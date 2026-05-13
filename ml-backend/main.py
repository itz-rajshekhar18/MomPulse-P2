#!/usr/bin/env python3
""
MomPulse ML Backend - Main Entry Point
======================================
Runs both Period Tracker and Pregnancy Wellness ML models simultaneously.

This script:
1. Trains both ML models on startup
2. Starts the Flask API server for Period Tracker
3. Starts the Pregnancy Wellness model server
4. Handles graceful shutdown

Usage:
    python main.py

Environment Variables:
    PORT: Flask server port (default: 5000)
    FLASK_ENV: Environment (development/production)
""

import sys
import os
import time
import threading
import signal
import logging
from datetime import datetime
from multiprocessing import Process, Queue
import json

# Add the ml-backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Global flag for graceful shutdown
shutdown_event = threading.Event()

def print_header():
    ""Print a nice header for the ML backend.""
    print("\n" + "=" * 80)
    print("  🤖 MOMPULSE ML BACKEND - MAIN SERVER")
    print("=" * 80)
    print(f"  Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80 + "\n")

def print_section(title):
    ""Print a section header.""
    print("\n" + "─" * 80)
    print(f"  {title}")
    print("─" * 80 + "\n")

def train_all_models():
    ""Train both ML models.""
    print_section("🎓 TRAINING ML MODELS")
    
    try:
        # Train Pregnancy Wellness Model
        print("  [1/2] Training Pregnancy Wellness Model...")
        import pregnancy_wellness_ml
        print("  ✓ Pregnancy Wellness Model trained successfully!")
        
        # Train Period Tracker Model
        print("\n  [2/2] Training Period Tracker Model...")
        from period_tracker_ml import compute_features, train_model
        import numpy as np
        from datetime import timedelta
        
        # Generate sample training data
        sample_cycles = []
        start_date = datetime(2024, 1, 1)
        
        for i in range(12):
            cycle_length = np.random.randint(26, 32)
            period_duration = np.random.randint(4, 7)
            
            cycle_start = start_date + timedelta(days=sum([np.random.randint(26, 32) for _ in range(i)]))
            cycle_end = cycle_start + timedelta(days=period_duration - 1)
            
            sample_cycles.append({
                "start_date": cycle_start.strftime("%Y-%m-%d"),
                "end_date": cycle_end.strftime("%Y-%m-%d"),
                "symptoms": ["cramps", "fatigue"],
                "flow_intensity": "medium"
            })
        
        # Train the model
        cycle_lengths, period_durations = compute_features(sample_cycles)
        model, scaler, avg_len = train_model(cycle_lengths)
        
        print(f"  ✓ Period Tracker Model trained successfully!")
        print(f"    - Average cycle length: {avg_len:.1f} days")
        print(f"    - Cycle lengths: {cycle_lengths}")
        print(f"    - Period durations: {period_durations}")
        
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
        
        print(f"  ✓ Model info saved → {out_path}")
        
        print("\n  ✓ All models trained successfully!")
        return True
        
    except Exception as e:
        logger.error(f"Error training models: {e}", exc_info=True)
        print(f"\n  ✗ Error training models: {e}")
        return False

def run_period_tracker_server():
    ""Run the Period Tracker Flask server.""
    print_section("🚀 STARTING PERIOD TRACKER SERVER")
    
    try:
        from period_tracker_ml import app
        
        port = int(os.environ.get('PORT', 5000))
        print(f"  Starting Period Tracker API on port {port}...")
        print(f"  ✓ Server running at http://localhost:{port}")
        print(f"  ✓ Endpoints:")
        print(f"    - POST /predict: Predict next period")
        print(f"    - POST /insights: Get cycle insights")
        print(f"    - GET /health: Health check")
        
        # Run Flask app
        app.run(
            host='0.0.0.0',
            port=port,
            debug=False,
            use_reloader=False,
            threaded=True
        )
        
    except Exception as e:
        logger.error(f"Error running Period Tracker server: {e}", exc_info=True)
        print(f"\n  ✗ Error running Period Tracker server: {e}")

def run_pregnancy_wellness_server():
    ""Run the Pregnancy Wellness model server.""
    print_section("🚀 STARTING PREGNANCY WELLNESS SERVER")
    
    try:
        from pregnancy_wellness_ml import app
        
        port = int(os.environ.get('PREGNANCY_PORT', 5001))
        print(f"  Starting Pregnancy Wellness API on port {port}...")
        print(f"  ✓ Server running at http://localhost:{port}")
        print(f"  ✓ Endpoints:")
        print(f"    - POST /predict: Get wellness predictions")
        print(f"    - POST /insights: Get pregnancy insights")
        print(f"    - GET /health: Health check")
        
        # Run Flask app
        app.run(
            host='0.0.0.0',
            port=port,
            debug=False,
            use_reloader=False,
            threaded=True
        )
        
    except Exception as e:
        logger.error(f"Error running Pregnancy Wellness server: {e}", exc_info=True)
        print(f"\n  ✗ Error running Pregnancy Wellness server: {e}")

def signal_handler(signum, frame):
    ""Handle shutdown signals gracefully.""
    print("\n\n" + "=" * 80)
    print("  ⚠️  Shutdown signal received. Gracefully shutting down...")
    print("=" * 80 + "\n")
    shutdown_event.set()
    sys.exit(0)

def main():
    ""Main entry point.""
    print_header()
    
    # Register signal handlers
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    # Train models first
    print_section("📊 INITIALIZATION")
    if not train_all_models():
        print("\n  ✗ Model training failed. Exiting.")
        sys.exit(1)
    
    # Start both servers in separate threads
    print_section("🔄 STARTING SERVERS")
    
    try:
        # Create threads for both servers
        period_tracker_thread = threading.Thread(
            target=run_period_tracker_server,
            daemon=True,
            name="PeriodTrackerServer"
        )
        
        pregnancy_wellness_thread = threading.Thread(
            target=run_pregnancy_wellness_server,
            daemon=True,
            name="PregnancyWellnessServer"
        )
        
        # Start both threads
        print("  Starting Period Tracker server...")
        period_tracker_thread.start()
        
        time.sleep(1)  # Small delay to avoid port conflicts
        
        print("  Starting Pregnancy Wellness server...")
        pregnancy_wellness_thread.start()
        
        print("\n" + "=" * 80)
        print("  ✓ ALL SERVERS RUNNING")
        print("=" * 80)
        print(f"  Period Tracker API:      http://localhost:5000")
        print(f"  Pregnancy Wellness API:  http://localhost:5001")
        print("=" * 80 + "\n")
        
        # Keep the main thread alive
        while not shutdown_event.is_set():
            time.sleep(1)
        
    except Exception as e:
        logger.error(f"Error starting servers: {e}", exc_info=True)
        print(f"\n  ✗ Error starting servers: {e}")
        sys.exit(1)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n  ⚠️  Interrupted by user.")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Fatal error: {e}", exc_info=True)
        print(f"\n\n  ✗ Fatal error: {e}")
        sys.exit(1)
