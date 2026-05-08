#!/bin/bash

# MomPulse ML Training Script
# ============================
# Trains all ML models for the MomPulse application
#
# Usage:
#   bash ml-backend/train.sh
#   or
#   cd ml-backend && bash train.sh

echo ""
echo "🤰 MomPulse ML Training Pipeline"
echo "=================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed."
    echo "   Please install Python 3.8 or higher."
    exit 1
fi

# Check Python version
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
echo "✓ Python version: $PYTHON_VERSION"

# Check if we're in the ml-backend directory
if [ -f "train_all_models.py" ]; then
    SCRIPT_DIR="."
elif [ -f "ml-backend/train_all_models.py" ]; then
    SCRIPT_DIR="ml-backend"
else
    echo "❌ Error: Cannot find train_all_models.py"
    echo "   Please run this script from the project root or ml-backend directory."
    exit 1
fi

# Check if virtual environment exists
if [ -d "$SCRIPT_DIR/venv" ]; then
    echo "✓ Virtual environment found"
    echo "  Activating virtual environment..."
    source "$SCRIPT_DIR/venv/bin/activate" 2>/dev/null || source "$SCRIPT_DIR/venv/Scripts/activate" 2>/dev/null
else
    echo "⚠️  No virtual environment found"
    echo "   Using system Python (not recommended)"
    echo ""
    read -p "   Create virtual environment? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "  Creating virtual environment..."
        python3 -m venv "$SCRIPT_DIR/venv"
        source "$SCRIPT_DIR/venv/bin/activate" 2>/dev/null || source "$SCRIPT_DIR/venv/Scripts/activate" 2>/dev/null
        echo "  Installing requirements..."
        pip install -r "$SCRIPT_DIR/requirements.txt"
    fi
fi

# Check if required packages are installed
echo ""
echo "Checking dependencies..."
python3 -c "import sklearn, numpy, pandas, flask, flask_cors" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "⚠️  Some required packages are missing"
    echo "   Installing requirements..."
    pip install -r "$SCRIPT_DIR/requirements.txt"
fi

echo ""
echo "Starting training pipeline..."
echo "=============================="
echo ""

# Run the training script
python3 "$SCRIPT_DIR/train_all_models.py"

# Capture exit code
EXIT_CODE=$?

echo ""
if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ Training completed successfully!"
    echo ""
    echo "📁 Model files generated:"
    echo "   - public/pregnancy_model.json"
    echo "   - public/period_model_info.json"
    echo ""
else
    echo "❌ Training failed with exit code $EXIT_CODE"
    echo "   Check the logs above for details."
    echo ""
fi

exit $EXIT_CODE
