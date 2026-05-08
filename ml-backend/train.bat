@echo off
REM MomPulse ML Training Script (Windows)
REM ======================================
REM Trains all ML models for the MomPulse application
REM
REM Usage:
REM   train.bat
REM   or
REM   cd ml-backend && train.bat

echo.
echo 🤰 MomPulse ML Training Pipeline
echo ==================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Python is not installed.
    echo    Please install Python 3.8 or higher.
    pause
    exit /b 1
)

REM Check Python version
for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
echo ✓ Python version: %PYTHON_VERSION%

REM Check if we're in the ml-backend directory
if exist "train_all_models.py" (
    set SCRIPT_DIR=.
) else if exist "ml-backend\train_all_models.py" (
    set SCRIPT_DIR=ml-backend
) else (
    echo ❌ Error: Cannot find train_all_models.py
    echo    Please run this script from the project root or ml-backend directory.
    pause
    exit /b 1
)

REM Check if virtual environment exists
if exist "%SCRIPT_DIR%\venv\Scripts\activate.bat" (
    echo ✓ Virtual environment found
    echo   Activating virtual environment...
    call "%SCRIPT_DIR%\venv\Scripts\activate.bat"
) else (
    echo ⚠️  No virtual environment found
    echo    Using system Python (not recommended)
    echo.
    set /p CREATE_VENV="   Create virtual environment? (y/n): "
    if /i "%CREATE_VENV%"=="y" (
        echo   Creating virtual environment...
        python -m venv "%SCRIPT_DIR%\venv"
        call "%SCRIPT_DIR%\venv\Scripts\activate.bat"
        echo   Installing requirements...
        pip install -r "%SCRIPT_DIR%\requirements.txt"
    )
)

REM Check if required packages are installed
echo.
echo Checking dependencies...
python -c "import sklearn, numpy, pandas, flask, flask_cors" >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Some required packages are missing
    echo    Installing requirements...
    pip install -r "%SCRIPT_DIR%\requirements.txt"
)

echo.
echo Starting training pipeline...
echo ==============================
echo.

REM Run the training script
python "%SCRIPT_DIR%\train_all_models.py"

REM Capture exit code
set EXIT_CODE=%ERRORLEVEL%

echo.
if %EXIT_CODE% equ 0 (
    echo ✅ Training completed successfully!
    echo.
    echo 📁 Model files generated:
    echo    - public\pregnancy_model.json
    echo    - public\period_model_info.json
    echo.
) else (
    echo ❌ Training failed with exit code %EXIT_CODE%
    echo    Check the logs above for details.
    echo.
)

pause
exit /b %EXIT_CODE%
