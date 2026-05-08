"""
MomPulse ML Training Pipeline
==============================
Main script to train all ML models for the MomPulse application.

This script trains:
1. Period Tracker ML Model (exports to public/period_model.json)
2. Pregnancy Wellness ML Model (exports to public/pregnancy_model.json)

Usage:
    python3 ml-backend/train_all_models.py

Requirements:
    - Python 3.8+
    - scikit-learn
    - numpy
    - pandas
    - flask (for period tracker)
    - flask-cors (for period tracker)

The trained models are exported as JSON files that can be loaded
by the React frontend for client-side inference.
"""

import sys
import os
import time
from datetime import datetime

# Add the ml-backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def print_header():
    """Print a nice header for the training pipeline."""
    print("\n" + "=" * 70)
    print("  🤰 MOMPULSE ML TRAINING PIPELINE")
    print("=" * 70)
    print(f"  Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70 + "\n")

def print_section(title, number, total):
    """Print a section header."""
    print("\n" + "─" * 70)
    print(f"  [{number}/{total}] {title}")
    print("─" * 70 + "\n")

def train_pregnancy_wellness_model():
    """Train the pregnancy wellness ML model."""
    print("  Importing pregnancy wellness training module...")
    
    # Import and execute the pregnancy wellness training script
    import pregnancy_wellness_ml
    
    print("\n  ✓ Pregnancy wellness model training completed!")
    return True

def train_period_tracker_model():
    """
    Note: The period tracker uses a Flask API with on-demand training.
    We'll create a standalone training script for it.
    """
    print("  Training period tracker model...")
    print("  Note: Period tracker model trains on-demand via Flask API.")
    print("  Creating a standalone training script for batch processing...")
    
    # Import the necessary components
    from period_tracker_ml import compute_features, train_model
    import numpy as np
    from datetime import datetime, timedelta
    import json
    
    # Generate sample training data
    print("  Generating sample cycle data for model validation...")
    
    sample_cycles = []
    start_date = datetime(2024, 1, 1)
    
    # Generate 12 months of sample cycles
    for i in range(12):
        cycle_length = np.random.randint(26, 32)  # Random cycle length 26-32 days
        period_duration = np.random.randint(4, 7)  # Random period 4-7 days
        
        cycle_start = start_date + timedelta(days=sum([np.random.randint(26, 32) for _ in range(i)]))
        cycle_end = cycle_start + timedelta(days=period_duration - 1)
        
        sample_cycles.append({
            "start_date": cycle_start.strftime("%Y-%m-%d"),
            "end_date": cycle_end.strftime("%Y-%m-%d"),
            "symptoms": ["cramps", "fatigue"],
            "flow_intensity": "medium"
        })
    
    # Train the model with sample data
    cycle_lengths, period_durations = compute_features(sample_cycles)
    model, scaler, avg_len = train_model(cycle_lengths)
    
    print(f"  Sample model trained successfully!")
    print(f"  - Average cycle length: {avg_len:.1f} days")
    print(f"  - Cycle lengths: {cycle_lengths}")
    print(f"  - Period durations: {period_durations}")
    
    # Export model info
    model_info = {
        "model_type": "GradientBoostingRegressor",
        "training_date": datetime.now().isoformat(),
        "sample_data_points": len(sample_cycles),
        "avg_cycle_length": float(avg_len),
        "cycle_length_std": float(np.std(cycle_lengths)),
        "avg_period_duration": float(np.mean(period_durations)),
        "note": "Period tracker model trains dynamically per user. This is validation only."
    }
    
    # Save model info
    out_dir = os.path.join(os.path.dirname(__file__), "..", "public")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "period_model_info.json")
    
    with open(out_path, "w") as f:
        json.dump(model_info, f, indent=2)
    
    print(f"  Model info saved → {out_path}")
    print("\n  ✓ Period tracker model validation completed!")
    return True

def print_summary(results):
    """Print a summary of the training results."""
    print("\n" + "=" * 70)
    print("  📊 TRAINING SUMMARY")
    print("=" * 70)
    
    for model_name, success in results.items():
        status = "✓ SUCCESS" if success else "✗ FAILED"
        print(f"  {status:12} | {model_name}")
    
    all_success = all(results.values())
    
    print("=" * 70)
    if all_success:
        print("  🎉 All models trained successfully!")
    else:
        print("  ⚠️  Some models failed to train. Check logs above.")
    print("=" * 70)
    print(f"  Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70 + "\n")
    
    return all_success

def main():
    """Main training pipeline."""
    print_header()
    
    results = {}
    start_time = time.time()
    
    # Train Model 1: Pregnancy Wellness
    try:
        print_section("Pregnancy Wellness ML Model", 1, 2)
        results["Pregnancy Wellness Model"] = train_pregnancy_wellness_model()
    except Exception as e:
        print(f"\n  ✗ Error training pregnancy wellness model: {e}")
        results["Pregnancy Wellness Model"] = False
    
    # Train Model 2: Period Tracker
    try:
        print_section("Period Tracker ML Model", 2, 2)
        results["Period Tracker Model"] = train_period_tracker_model()
    except Exception as e:
        print(f"\n  ✗ Error training period tracker model: {e}")
        results["Period Tracker Model"] = False
    
    # Print summary
    elapsed_time = time.time() - start_time
    all_success = print_summary(results)
    
    print(f"  Total training time: {elapsed_time:.2f} seconds\n")
    
    # Exit with appropriate code
    sys.exit(0 if all_success else 1)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n  ⚠️  Training interrupted by user.")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n  ✗ Fatal error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
