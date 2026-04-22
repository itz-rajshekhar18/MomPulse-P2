@echo off
echo ========================================
echo MomPulse ML Backend Installation (Windows)
echo ========================================
echo.

REM Navigate to ml-backend directory
cd /d "%~dp0"

echo Step 1: Creating virtual environment...
python -m venv myenv
if errorlevel 1 (
    echo ERROR: Failed to create virtual environment
    echo Make sure Python is installed and in PATH
    pause
    exit /b 1
)
echo Virtual environment created successfully!
echo.

echo Step 2: Activating virtual environment...
call myenv\Scripts\activate.bat
echo.

echo Step 3: Upgrading pip...
python -m pip install --upgrade pip
echo.

echo Step 4: Installing packages (this may take a few minutes)...
echo Installing NumPy...
pip install --only-binary :all: numpy==1.26.2
if errorlevel 1 (
    echo Trying alternative NumPy version...
    pip install numpy
)
echo.

echo Installing Pandas...
pip install --only-binary :all: pandas==2.1.4
if errorlevel 1 (
    echo Trying alternative Pandas version...
    pip install pandas
)
echo.

echo Installing scikit-learn...
pip install --only-binary :all: scikit-learn==1.3.2
if errorlevel 1 (
    echo Trying alternative scikit-learn version...
    pip install scikit-learn
)
echo.

echo Installing Flask and Flask-CORS...
pip install flask==3.0.0 flask-cors==4.0.0
echo.

echo Step 5: Verifying installation...
python -c "import numpy; print('NumPy version:', numpy.__version__)"
python -c "import pandas; print('Pandas version:', pandas.__version__)"
python -c "import sklearn; print('scikit-learn version:', sklearn.__version__)"
python -c "import flask; print('Flask version:', flask.__version__)"
echo.

echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo To start the ML backend server, run:
echo   myenv\Scripts\activate
echo   python period_tracker_ml.py
echo.
echo The server will run on http://localhost:5050
echo.
pause
