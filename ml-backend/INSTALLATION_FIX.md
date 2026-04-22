# ML Backend Installation Fix for Windows

## Problem
The error occurs because your path contains Korean characters (`문서` = Documents in Korean), and NumPy's build process can't handle non-ASCII characters in Windows paths.

## Solution Options

### Option 1: Use Pre-built Wheels (RECOMMENDED - Fastest)

Instead of building from source, install pre-built binary wheels:

```bash
# 1. Activate your virtual environment
cd ml-backend
myenv\Scripts\activate

# 2. Upgrade pip first
python -m pip install --upgrade pip

# 3. Install packages using pre-built wheels
pip install --only-binary :all: numpy==1.26.2
pip install --only-binary :all: pandas==2.1.4
pip install --only-binary :all: scikit-learn==1.3.2
pip install flask==3.0.0
pip install flask-cors==4.0.0

# 4. Verify installation
python -c "import numpy; print(numpy.__version__)"
python -c "import pandas; print(pandas.__version__)"
python -c "import sklearn; print(sklearn.__version__)"
```

### Option 2: Move Project to ASCII Path

Move your project to a path without special characters:

```bash
# Move from:
C:\Users\Raj Shekhar\OneDrive\문서\Mompulse-finaleProto

# To:
C:\Projects\Mompulse-finaleProto
# or
C:\Users\Raj Shekhar\Desktop\Mompulse-finaleProto
```

Then reinstall:
```bash
cd C:\Projects\Mompulse-finaleProto\mompulse\ml-backend
python -m venv myenv
myenv\Scripts\activate
pip install -r requirements.txt
```

### Option 3: Set Environment Variable

Set UTF-8 encoding before installation:

```bash
# In PowerShell
$env:PYTHONUTF8=1
cd ml-backend
myenv\Scripts\activate
pip install -r requirements.txt
```

Or in Command Prompt:
```cmd
set PYTHONUTF8=1
cd ml-backend
myenv\Scripts\activate
pip install -r requirements.txt
```

### Option 4: Use Conda (Alternative Package Manager)

If you have Anaconda/Miniconda installed:

```bash
cd ml-backend
conda create -n mompulse-ml python=3.11
conda activate mompulse-ml
conda install numpy pandas scikit-learn
pip install flask flask-cors
```

## Quick Fix Script (PowerShell)

Save this as `install-ml-backend.ps1`:

```powershell
# Navigate to ml-backend directory
cd ml-backend

# Create virtual environment
python -m venv myenv

# Activate virtual environment
.\myenv\Scripts\Activate.ps1

# Upgrade pip
python -m pip install --upgrade pip

# Install packages with pre-built wheels only
pip install --only-binary :all: numpy==1.26.2
pip install --only-binary :all: pandas==2.1.4
pip install --only-binary :all: scikit-learn==1.3.2
pip install flask==3.0.0
pip install flask-cors==4.0.0

# Test installation
python -c "import numpy, pandas, sklearn, flask; print('All packages installed successfully!')"

Write-Host "Installation complete! Run 'python period_tracker_ml.py' to start the server."
```

Run it:
```powershell
powershell -ExecutionPolicy Bypass -File install-ml-backend.ps1
```

## Verification

After installation, verify everything works:

```bash
cd ml-backend
myenv\Scripts\activate
python period_tracker_ml.py
```

You should see:
```
 * Running on http://127.0.0.1:5050
```

## If Still Having Issues

### Try Older NumPy Version
```bash
pip install numpy==1.24.3 pandas==2.0.3 scikit-learn==1.3.0
```

### Or Use Minimal Requirements
```bash
pip install numpy pandas scikit-learn flask flask-cors
# This installs latest compatible versions
```

## Test the Backend

Once installed, test with curl:

```bash
curl -X GET http://localhost:5050/api/health
```

Should return:
```json
{"status": "ok"}
```

## Common Errors and Fixes

### Error: "No module named 'numpy'"
```bash
pip install numpy
```

### Error: "Flask not found"
```bash
pip install flask flask-cors
```

### Error: "Permission denied"
Run PowerShell/CMD as Administrator

### Error: "Python not found"
Add Python to PATH or use full path:
```bash
C:\Python311\python.exe -m pip install ...
```

## Success Checklist

- [ ] Virtual environment created
- [ ] All packages installed without errors
- [ ] `python period_tracker_ml.py` runs successfully
- [ ] Server responds on http://localhost:5050
- [ ] Health check returns `{"status": "ok"}`

## Next Steps

After successful installation:

1. Keep the Flask server running
2. Start your Next.js app: `npm run dev`
3. Test the integration by logging a cycle
4. Check predictions in the Insights page

## Need Help?

If you're still having issues:
1. Share the exact error message
2. Check Python version: `python --version` (should be 3.8+)
3. Check pip version: `pip --version`
4. Try the pre-built wheels option (Option 1) - it's the most reliable
