@echo off
echo Starting MomPulse ML Backend Server...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher from https://www.python.org/
    pause
    exit /b 1
)

echo Installing required packages...
pip install flask flask-cors numpy pandas scikit-learn

echo.
echo Starting Flask server on port 5050...
echo.
python period_tracker_ml.py

pause
