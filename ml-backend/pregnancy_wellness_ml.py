"""
Pregnancy Wellness ML Model — Python / scikit-learn
====================================================
Trains a two-headed model:
• Risk classifier  : MLPClassifier  →  3 classes (thriving / moderate / needs attention)
• Wellness scorer  : MLPRegressor   →  continuous score 0-100

Both share the same 7 input features:
[week, energy, sleep, symptom_count, water_pct, diet_pct, trimester]

After training the script:
1. Prints evaluation metrics on a held-out test set.
2. Exports model weights + architecture to  ../public/model.json
   so the React app can load and run inference entirely client-side.

Usage:
    python3 ml-backend/pregnancy_wellness_ml.py
"""

import json
import math
import random
import numpy as np
from sklearn.neural_network import MLPClassifier, MLPRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import (
    classification_report, mean_absolute_error, r2_score
)

random.seed(42)
np.random.seed(42)

# ─── 1. Feature engineering ───────────────────────────────────────────────────

FEATURE_NAMES = [
    "week", "energy", "sleep", "symptom_count",
    "water_pct", "diet_pct", "trimester"
]

FEATURE_RANGES = {          # used for normalisation reference
    "week":         (1, 40),
    "energy":       (1, 10),
    "sleep":        (0, 12),
    "symptom_count":(0, 12),
    "water_pct":    (0, 100),
    "diet_pct":     (0, 100),
    "trimester":    (1, 3),
}

RISK_LABELS = {
    0: "Thriving", 
    1: "Moderate Concern", 
    2: "Needs Attention"
}

def get_trimester(week: int) -> int:
    if week <= 12:
        return 1
    elif week <= 27:
        return 2
    return 3

def rule_wellness_score(energy, sleep, symptoms, water_pct, diet_pct) -> float:
    """
    Evidence-based heuristic wellness score (0-100).
    Used as the regression target so the model learns medically grounded values.
    
    - Energy (1-10)      : optimal ~8, penalty for < 5
    - Sleep (hrs)        : optimal 7-9 h; penalty outside that window
    - Symptom count      : -4 pts per symptom (capped at 12)
    - Hydration %        : linear reward up to 100%
    - Diet adherence %   : linear reward up to 100%
    """
    score = 50.0
    
    # Energy contribution  (max ±20)
    score += (energy - 5) * 4.0
    
    # Sleep contribution  (penalty for < 7 h or > 10 h)
    if sleep < 7:
        score -= (7 - sleep) * 5.0
    elif sleep > 10:
        score -= (sleep - 10) * 3.0
    else:
        score += (sleep - 7) * 2.0          # small bonus for 7-10 h
    
    # Symptom load  (−4 per symptom, capped)
    score -= min(symptoms, 12) * 4.0
    
    # Hydration  (+10 if fully hydrated)
    score += (water_pct / 100) * 10.0
    
    # Diet adherence  (+10 if fully adherent)
    score += (diet_pct / 100) * 10.0
    
    return float(np.clip(score, 0, 100))

def risk_class(wellness: float) -> int:
    if wellness >= 68:
        return 0   # Thriving
    elif wellness >= 42:
        return 1   # Moderate Concern
    return 2       # Needs Attention

# ─── 2. Synthetic dataset generation ─────────────────────────────────────────

def generate_dataset():
    rows = []
    
    # Structured grid — covers all important combinations
    for week in range(1, 41, 2):
        tri = get_trimester(week)
        for energy in [1, 3, 5, 7, 9, 10]:
            for sleep in [3, 5, 7, 8.5, 10, 12]:
                for symptoms in [0, 2, 5, 8, 11]:
                    for water_pct in [10, 40, 70, 100]:
                        for diet_pct in [10, 40, 70, 100]:
                            ws = rule_wellness_score(
                                energy, sleep, symptoms, water_pct, diet_pct
                            )
                            rows.append({
                                "features": [week, energy, sleep, symptoms,
                                           water_pct, diet_pct, tri],
                                "risk":     risk_class(ws),
                                "wellness": ws,
                            })
    
    # Random noise rows for robustness  (~1 200 extra)
    for _ in range(1200):
        week     = random.randint(1, 40)
        energy   = round(random.uniform(1, 10), 1)
        sleep    = round(random.uniform(2, 12), 1)
        symptoms = random.randint(0, 12)
        water_p  = round(random.uniform(0, 100), 1)
        diet_p   = round(random.uniform(0, 100), 1)
        tri      = get_trimester(week)
        ws       = rule_wellness_score(energy, sleep, symptoms, water_p, diet_p)
        
        rows.append({
            "features": [week, energy, sleep, symptoms, water_p, diet_p, tri],
            "risk":     risk_class(ws),
            "wellness": ws,
        })
    
    return rows

# ─── 3. Build feature matrix & targets ───────────────────────────────────────

print("─" * 55)
print("  Pregnancy Wellness ML Model  ·  scikit-learn")
print("─" * 55)

print("\n[1/5] Generating synthetic dataset …")
dataset = generate_dataset()
print(f"      Total samples: {len(dataset)}")

X = np.array([r["features"] for r in dataset], dtype=np.float32)
y_risk    = np.array([r["risk"]     for r in dataset], dtype=np.int32)
y_wellness= np.array([r["wellness"] for r in dataset], dtype=np.float32)

# ─── 4. Normalise features ────────────────────────────────────────────────────

print("[2/5] Normalising features …")
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)

# Store scaler params for JS inference
scaler_params = {
    "min":   scaler.data_min_.tolist(),
    "scale": scaler.scale_.tolist(),
}

# ─── 5. Train / test split ────────────────────────────────────────────────────

X_train, X_test, yr_train, yr_test, yw_train, yw_test = train_test_split(
    X_scaled, y_risk, y_wellness,
    test_size=0.15, random_state=42, stratify=y_risk
)

print(f"      Train: {len(X_train)}  │  Test: {len(X_test)}")

# ─── 6. Train risk classifier ─────────────────────────────────────────────────

print("\n[3/5] Training risk classifier (MLPClassifier) …")
clf = MLPClassifier(
    hidden_layer_sizes=(64, 32, 16),
    activation="relu",
    solver="adam",
    learning_rate_init=0.003,
    max_iter=500,
    random_state=42,
    early_stopping=True,
    validation_fraction=0.1,
    n_iter_no_change=20,
    verbose=False,
)
clf.fit(X_train, yr_train)

yr_pred = clf.predict(X_test)
print("\n  Risk Classifier — Test Set Report:")
print(classification_report(
    yr_test, yr_pred,
    target_names=[RISK_LABELS[i] for i in range(3)]
))

# ─── 7. Train wellness regressor ──────────────────────────────────────────────

print("[4/5] Training wellness regressor (MLPRegressor) …")
reg = MLPRegressor(
    hidden_layer_sizes=(64, 32, 16),
    activation="relu",
    solver="adam",
    learning_rate_init=0.003,
    max_iter=500,
    random_state=42,
    early_stopping=True,
    validation_fraction=0.1,
    n_iter_no_change=20,
    verbose=False,
)
reg.fit(X_train, yw_train)

yw_pred = reg.predict(X_test)
mae = mean_absolute_error(yw_test, yw_pred)
r2  = r2_score(yw_test, yw_pred)

print(f"  Wellness Regressor → MAE: {mae:.2f} pts  │  R²: {r2:.4f}")

# ─── 8. Export weights to JSON ────────────────────────────────────────────────

print("\n[5/5] Exporting model weights to public/pregnancy_model.json …")

def mlp_to_dict(mlp) -> dict:
    """Serialise an sklearn MLP (classifier or regressor) to plain JSON."""
    layers = []
    for W, b in zip(mlp.coefs_, mlp.intercepts_):
        layers.append({
            "weights": W.tolist(),
            "biases":  b.tolist(),
            "in":      int(W.shape[0]),
            "out":     int(W.shape[1]),
        })
    return {
        "n_layers":   len(layers),
        "activation": mlp.activation,   # relu / tanh / logistic
        "layers":     layers,
    }

export = {
    "version":  "1.0",
    "trained_with": "scikit-learn MLPClassifier + MLPRegressor",
    "feature_names": FEATURE_NAMES,
    "feature_ranges": FEATURE_RANGES,
    "scaler": scaler_params,
    "classifier": {
        **mlp_to_dict(clf),
        "out_activation": clf.out_activation_,  # softmax
        "n_classes": 3,
        "classes":   clf.classes_.tolist(),
    },
    "regressor": {
        **mlp_to_dict(reg),
        "out_activation": reg.out_activation_,  # identity (linear)
        "output_range": [0, 100],
    },
    "metrics": {
        "classifier_accuracy": float(round(sum(yr_pred == yr_test) / len(yr_test), 4)),
        "regressor_mae":  float(round(mae, 2)),
        "regressor_r2":   float(round(r2, 4)),
        "train_samples":  len(X_train),
        "test_samples":   len(X_test),
    },
}

import os
out_dir  = os.path.join(os.path.dirname(__file__), "..", "public")
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "pregnancy_model.json")

with open(out_path, "w") as f:
    json.dump(export, f, separators=(",", ":"))

size_kb = os.path.getsize(out_path) / 1024
print(f"      Saved → {out_path}  ({size_kb:.1f} KB)")

print("\n─" * 28)
print("  Training complete ✓")
print(f"  Classifier accuracy : {export['metrics']['classifier_accuracy']*100:.1f}%")
print(f"  Regressor MAE       : {export['metrics']['regressor_mae']} pts")
print(f"  Regressor R²        : {export['metrics']['regressor_r2']}")
print("─" * 28)
