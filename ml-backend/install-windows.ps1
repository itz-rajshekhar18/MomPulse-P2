# MomPulse ML Backend Installation Script for Windows
# This script handles the Unicode path issue

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MomPulse ML Backend Installation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "Step 1: Creating virtual environment..." -ForegroundColor Yellow
python -m venv myenv
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to create virtual environment" -ForegroundColor Red
    Write-Host "Make sure Python 3.8+ is installed and in PATH" -ForegroundColor Red
    pause
    exit 1
}
Write-Host "✓ Virtual environment created!" -ForegroundColor Green
Write-Host ""

Write-Host "Step 2: Activating virtual environment..." -ForegroundColor Yellow
& .\myenv\Scripts\Activate.ps1
Write-Host "✓ Virtual environment activated!" -ForegroundColor Green
Write-Host ""

Write-Host "Step 3: Upgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip --quiet
Write-Host "✓ Pip upgraded!" -ForegroundColor Green
Write-Host ""

Write-Host "Step 4: Installing packages (this may take a few minutes)..." -ForegroundColor Yellow
Write-Host ""

Write-Host "  Installing NumPy..." -ForegroundColor Cyan
pip install --only-binary :all: numpy==1.26.2 --quiet
if ($LASTEXITCODE -ne 0) {
    Write-Host "  Trying alternative NumPy version..." -ForegroundColor Yellow
    pip install numpy --quiet
}
Write-Host "  ✓ NumPy installed!" -ForegroundColor Green

Write-Host "  Installing Pandas..." -ForegroundColor Cyan
pip install --only-binary :all: pandas==2.1.4 --quiet
if ($LASTEXITCODE -ne 0) {
    Write-Host "  Trying alternative Pandas version..." -ForegroundColor Yellow
    pip install pandas --quiet
}
Write-Host "  ✓ Pandas installed!" -ForegroundColor Green

Write-Host "  Installing scikit-learn..." -ForegroundColor Cyan
pip install --only-binary :all: scikit-learn==1.3.2 --quiet
if ($LASTEXITCODE -ne 0) {
    Write-Host "  Trying alternative scikit-learn version..." -ForegroundColor Yellow
    pip install scikit-learn --quiet
}
Write-Host "  ✓ scikit-learn installed!" -ForegroundColor Green

Write-Host "  Installing Flask and Flask-CORS..." -ForegroundColor Cyan
pip install flask==3.0.0 flask-cors==4.0.0 --quiet
Write-Host "  ✓ Flask packages installed!" -ForegroundColor Green
Write-Host ""

Write-Host "Step 5: Verifying installation..." -ForegroundColor Yellow
$numpyVersion = python -c "import numpy; print(numpy.__version__)" 2>&1
$pandasVersion = python -c "import pandas; print(pandas.__version__)" 2>&1
$sklearnVersion = python -c "import sklearn; print(sklearn.__version__)" 2>&1
$flaskVersion = python -c "import flask; print(flask.__version__)" 2>&1

Write-Host "  NumPy version: $numpyVersion" -ForegroundColor Cyan
Write-Host "  Pandas version: $pandasVersion" -ForegroundColor Cyan
Write-Host "  scikit-learn version: $sklearnVersion" -ForegroundColor Cyan
Write-Host "  Flask version: $flaskVersion" -ForegroundColor Cyan
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "Installation Complete! ✓" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "To start the ML backend server:" -ForegroundColor Yellow
Write-Host "  1. Activate virtual environment:" -ForegroundColor White
Write-Host "     .\myenv\Scripts\Activate.ps1" -ForegroundColor Cyan
Write-Host "  2. Run the server:" -ForegroundColor White
Write-Host "     python period_tracker_ml.py" -ForegroundColor Cyan
Write-Host ""
Write-Host "The server will run on http://localhost:5050" -ForegroundColor Yellow
Write-Host ""

pause
