from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.linear_model import Ridge
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingRegressor
from datetime import datetime, timedelta
import json
import os

app = Flask(__name__)
CORS(app)

def compute_features(cycles):
    """Given a list of cycles (each with start_date, end_date),
    compute features for prediction."""
    if len(cycles) < 2:
        return None, None
    
    starts = [datetime.strptime(c["start_date"], "%Y-%m-%d") for c in cycles]
    ends = [datetime.strptime(c["end_date"], "%Y-%m-%d") for c in cycles]
    
    cycle_lengths = []
    period_durations = []
    
    for i in range(1, len(starts)):
        cycle_len = (starts[i] - starts[i - 1]).days
        cycle_lengths.append(cycle_len)
    
    for s, e in zip(starts, ends):
        period_durations.append((e - s).days + 1)
    
    return cycle_lengths, period_durations

def train_model(cycle_lengths):
    """Train a regression model on cycle lengths."""
    if len(cycle_lengths) < 3:
        # Not enough data - return simple average
        return None, None, np.mean(cycle_lengths)
    
    X, y = [], []
    window = min(3, len(cycle_lengths) - 1)
    
    for i in range(window, len(cycle_lengths)):
        features = cycle_lengths[i - window: i]
        # Add rolling stats as features
        features_ext = features + [
            np.mean(features),
            np.std(features) if len(features) > 1 else 0,
            max(features) - min(features)
        ]
        X.append(features_ext)
        y.append(cycle_lengths[i])
    
    if len(X) < 2:
        return None, None, np.mean(cycle_lengths)
    
    X = np.array(X)
    y = np.array(y)
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    model = GradientBoostingRegressor(
        n_estimators=100,
        max_depth=3,
        learning_rate=0.1,
        random_state=42
    )
    model.fit(X_scaled, y)
    
    return model, scaler, np.mean(cycle_lengths)

def predict_next_cycle(cycle_lengths, model, scaler, avg_len):
    """Predict the next cycle length."""
    if model is None:
        return round(avg_len)
    
    window = min(3, len(cycle_lengths))
    recent = cycle_lengths[-window:]
    
    features = recent + [
        np.mean(recent),
        np.std(recent) if len(recent) > 1 else 0,
        max(recent) - min(recent)
    ]
    
    # Pad if needed
    expected_len = min(3, len(cycle_lengths) - 1) + 3
    while len(features) < expected_len:
        features.insert(0, avg_len)
    
    X = np.array(features).reshape(1, -1)
    X_scaled = scaler.transform(X)
    predicted = model.predict(X_scaled)[0]
    
    # Clamp to reasonable range (21-45 days)
    return int(np.clip(round(predicted), 21, 45))

@app.route("/api/predict", methods=["POST"])
def predict():
    """Predict next cycle based on provided cycle data."""
    body = request.json
    cycles = body.get("cycles", [])
    
    if len(cycles) == 0:
        return jsonify({"error": "No cycle data available"}), 400
    
    if len(cycles) == 1:
        # Only one period logged - use default 28 day cycle
        last_start = datetime.strptime(cycles[-1]["start_date"], "%Y-%m-%d")
        last_end = datetime.strptime(cycles[-1]["end_date"], "%Y-%m-%d")
        avg_period = (last_end - last_start).days + 1
        
        next_start = last_start + timedelta(days=28)
        next_end = next_start + timedelta(days=avg_period - 1)
        ovulation = next_start - timedelta(days=14)
        
        return jsonify({
            "next_period_start": next_start.strftime("%Y-%m-%d"),
            "next_period_end": next_end.strftime("%Y-%m-%d"),
            "predicted_cycle_length": 28,
            "ovulation_date": ovulation.strftime("%Y-%m-%d"),
            "fertile_window_start": (ovulation - timedelta(days=5)).strftime("%Y-%m-%d"),
            "fertile_window_end": (ovulation + timedelta(days=1)).strftime("%Y-%m-%d"),
            "avg_cycle_length": 28,
            "avg_period_duration": avg_period,
            "cycle_regularity": "unknown",
            "confidence": "low",
            "data_points": 1,
            "cycle_lengths": [],
            "period_durations": [avg_period]
        })
    
    cycle_lengths, period_durations = compute_features(cycles)
    model, scaler, avg_len = train_model(cycle_lengths)
    predicted_len = predict_next_cycle(cycle_lengths, model, scaler, avg_len)
    
    last_start = datetime.strptime(cycles[-1]["start_date"], "%Y-%m-%d")
    last_end = datetime.strptime(cycles[-1]["end_date"], "%Y-%m-%d")
    avg_period_duration = round(np.mean(period_durations))
    
    next_start = last_start + timedelta(days=predicted_len)
    next_end = next_start + timedelta(days=avg_period_duration - 1)
    ovulation = next_start - timedelta(days=14)
    fertile_start = ovulation - timedelta(days=5)
    fertile_end = ovulation + timedelta(days=1)
    
    # Regularity score
    if len(cycle_lengths) >= 3:
        std_dev = np.std(cycle_lengths)
        if std_dev <= 2:
            regularity = "very regular"
        elif std_dev <= 5:
            regularity = "mostly regular"
        elif std_dev <= 8:
            regularity = "somewhat irregular"
        else:
            regularity = "irregular"
    else:
        regularity = "insufficient data"
    
    confidence = "high" if len(cycles) >= 6 else "medium" if len(cycles) >= 3 else "low"
    
    return jsonify({
        "next_period_start": next_start.strftime("%Y-%m-%d"),
        "next_period_end": next_end.strftime("%Y-%m-%d"),
        "predicted_cycle_length": predicted_len,
        "ovulation_date": ovulation.strftime("%Y-%m-%d"),
        "fertile_window_start": fertile_start.strftime("%Y-%m-%d"),
        "fertile_window_end": fertile_end.strftime("%Y-%m-%d"),
        "avg_cycle_length": round(float(avg_len), 1),
        "avg_period_duration": avg_period_duration,
        "cycle_regularity": regularity,
        "confidence": confidence,
        "data_points": len(cycles),
        "cycle_lengths": cycle_lengths,
        "period_durations": period_durations
    })

@app.route("/api/insights", methods=["POST"])
def insights():
    """Generate insights based on cycle data."""
    body = request.json
    cycles = body.get("cycles", [])
    
    if len(cycles) < 2:
        return jsonify({"insights": []})
    
    cycle_lengths, period_durations = compute_features(cycles)
    insights_list = []
    
    avg_len = np.mean(cycle_lengths)
    if avg_len < 24:
        insights_list.append({
            "type": "warning",
            "text": "Your cycles are shorter than average (< 24 days). Consider consulting a healthcare provider."
        })
    elif avg_len > 38:
        insights_list.append({
            "type": "warning",
            "text": "Your cycles are longer than average (> 38 days). Consider consulting a healthcare provider."
        })
    else:
        insights_list.append({
            "type": "info",
            "text": f"Your average cycle length is {round(avg_len)} days, which is within the normal range."
        })
    
    std_dev = np.std(cycle_lengths) if len(cycle_lengths) > 1 else 0
    if std_dev > 8:
        insights_list.append({
            "type": "warning",
            "text": "High variability detected in your cycles. Stress, diet, or health factors may be influencing your cycle."
        })
    elif std_dev <= 2:
        insights_list.append({
            "type": "success",
            "text": "Your cycles are very consistent! Great for prediction accuracy."
        })
    
    avg_period = np.mean(period_durations)
    if avg_period > 7:
        insights_list.append({
            "type": "warning",
            "text": "Your periods last longer than 7 days on average. This is worth discussing with your doctor."
        })
    elif avg_period < 2:
        insights_list.append({
            "type": "warning",
            "text": "Your periods seem very short. Ensure you are logging dates accurately."
        })
    else:
        insights_list.append({
            "type": "info",
            "text": f"Your average period duration is {round(avg_period)} days."
        })
    
    if len(cycles) >= 3:
        recent = cycle_lengths[-3:]
        trend = np.polyfit(range(len(recent)), recent, 1)[0]
        if trend > 1.5:
            insights_list.append({
                "type": "info",
                "text": "Your recent cycles are getting longer."
            })
        elif trend < -1.5:
            insights_list.append({
                "type": "info",
                "text": "Your recent cycles are getting shorter."
            })
    
    # Symptom frequency
    all_symptoms = []
    for c in cycles:
        all_symptoms.extend(c.get("symptoms", []))
    
    if all_symptoms:
        from collections import Counter
        symptom_counts = Counter(all_symptoms)
        top = symptom_counts.most_common(1)[0]
        insights_list.append({
            "type": "info",
            "text": f"Most common symptom: {top[0]} (reported {top[1]} time(s))."
        })
    
    return jsonify({"insights": insights_list})

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(port=5050, debug=True)