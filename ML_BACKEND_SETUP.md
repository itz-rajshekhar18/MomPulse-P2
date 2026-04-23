# ML Backend Setup Guide

Complete guide to set up and integrate the Machine Learning backend with MomPulse.

## Overview

The ML backend provides AI-powered period predictions using machine learning algorithms. It analyzes cycle history to predict:
- Next period start/end dates
- Ovulation dates
- Fertile windows
- Cycle regularity patterns
- Personalized health insights

## Architecture

```
User logs cycle → Firestore → Next.js API → ML Backend (Python Flask)
                                    ↓
                            Prediction saved to Firestore
                                    ↓
                            Dashboard displays prediction
```

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Node.js and npm (for Next.js app)
- Firebase project configured

## Step 1: Install Python Dependencies

### Windows

1. Open Command Prompt or PowerShell
2. Navigate to the ml-backend folder:
   ```bash
   cd mompulse/ml-backend
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Linux/Mac

```bash
cd mompulse/ml-backend
pip3 install -r requirements.txt
```

## Step 2: Start the ML Backend Server

### Windows

Double-click `start-ml-server.bat` or run:
```bash
start-ml-server.bat
```

### Linux/Mac

```bash
python3 period_tracker_ml.py
```

The server will start on `http://localhost:5050`

You should see:
```
 * Running on http://127.0.0.1:5050
 * Restarting with stat
 * Debugger is active!
```

## Step 3: Configure Next.js App

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and set:
   ```
   ML_BACKEND_URL=http://localhost:5050
   ```

3. Restart your Next.js development server:
   ```bash
   npm run dev
   ```

## Step 4: Test the Integration

### Test 1: Health Check

Open your browser and visit:
```
http://localhost:5050/api/health
```

You should see:
```json
{
  "status": "ok"
}
```

### Test 2: Log a Cycle

1. Log in to MomPulse
2. Go to "My Cycle" configuration
3. Log your first cycle with start and end dates
4. Check the browser console for API calls

### Test 3: View Predictions

1. Go to the Period Tracker Dashboard
2. You should see "🤖 AI-Powered Prediction" badge
3. Check the "Next Period" prediction

## How It Works

### 1. Cycle Logging Flow

```javascript
// User logs cycle in My Cycle page
saveCycleData(userId, cycleData)
  ↓
// Saved to Firestore /users/{uid}/cycles
  ↓
// Automatically triggers ML prediction
fetch('/api/ml/period-prediction', {
  method: 'POST',
  body: JSON.stringify({ userId, cycles })
})
  ↓
// Next.js API calls Python Flask backend
fetch('http://localhost:5050/api/predict', {
  method: 'POST',
  body: JSON.stringify({ cycles })
})
  ↓
// ML model processes data and returns prediction
  ↓
// Prediction saved to Firestore /users/{uid}/predictions/period
  ↓
// Dashboard fetches and displays prediction
```

### 2. Prediction Display Flow

```javascript
// Dashboard loads
CycleProgressCard component mounts
  ↓
// Fetch user cycles
getUserCycles(userId)
  ↓
// Fetch ML prediction
getPeriodPrediction(userId)
  ↓
// Display prediction with AI badge
```

## Fallback Mechanism

If the ML backend is unavailable, the app automatically uses a fallback calculation:

1. Calculates average cycle length from history
2. Calculates average period length
3. Predicts next period based on averages
4. Calculates ovulation (14 days before period)
5. Determines fertile window

This ensures the app works even without the ML backend running.

## Firestore Structure

### Cycles Collection
```
/users/{userId}/cycles/{cycleId}
  - start_date: "2024-01-01"
  - end_date: "2024-01-05"
  - symptoms: ["cramps", "headache"]
  - flow_intensity: "medium"
  - notes: "felt good"
  - createdAt: Timestamp
  - updatedAt: Timestamp
```

### Predictions Collection
```
/users/{userId}/predictions/period
  - nextPeriodDate: "2024-02-01"
  - nextOvulationDate: "2024-01-18"
  - predictedCycleLength: 28
  - predictedPeriodLength: 5
  - confidence: 0.85
  - fertileWindow:
      start: "2024-01-13"
      end: "2024-01-19"
  - insights: ["Cycle regularity: very regular", ...]
  - createdAt: Timestamp
  - updatedAt: Timestamp
```

## Troubleshooting

### ML Backend Not Starting

**Error:** `ModuleNotFoundError: No module named 'flask'`

**Solution:**
```bash
pip install flask flask-cors numpy pandas scikit-learn
```

---

**Error:** `Port 5050 is already in use`

**Solution:** Change the port in `period_tracker_ml.py`:
```python
app.run(port=5051, debug=True)
```

And update `.env.local`:
```
ML_BACKEND_URL=http://localhost:5051
```

---

### Predictions Not Showing

**Check 1:** Is the ML backend running?
```bash
curl http://localhost:5050/api/health
```

**Check 2:** Check browser console for errors

**Check 3:** Check Firestore for prediction data:
- Go to Firebase Console
- Navigate to Firestore Database
- Check `/users/{your-uid}/predictions/period`

---

### CORS Errors

**Error:** `Access to fetch at 'http://localhost:5050' has been blocked by CORS policy`

**Solution:** The Flask app has CORS enabled. Check:
1. ML backend is running
2. URL in `.env.local` is correct
3. No firewall blocking the connection

---

### Prediction Accuracy Issues

**Issue:** Predictions seem inaccurate

**Solutions:**
1. Log at least 3 cycles for better accuracy
2. Ensure dates are entered correctly
3. Check that cycle lengths are realistic (21-45 days)
4. More data = better predictions (6+ cycles recommended)

## Production Deployment

### Deploy ML Backend

**Option 1: Cloud Run (Google Cloud)**
```bash
gcloud run deploy mompulse-ml \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

**Option 2: AWS Lambda**
Use Zappa or AWS SAM to deploy Flask app

**Option 3: Heroku**
```bash
heroku create mompulse-ml
git push heroku main
```

### Update Production Environment

Set `ML_BACKEND_URL` in your production environment:
```
ML_BACKEND_URL=https://your-ml-backend.com
```

### Security Considerations

1. **Add API Authentication:**
   ```python
   @app.before_request
   def check_api_key():
       api_key = request.headers.get('X-API-Key')
       if api_key != os.environ.get('API_KEY'):
           return jsonify({'error': 'Unauthorized'}), 401
   ```

2. **Rate Limiting:**
   ```python
   from flask_limiter import Limiter
   limiter = Limiter(app, key_func=get_remote_address)
   
   @app.route('/api/predict', methods=['POST'])
   @limiter.limit("10 per minute")
   def predict():
       # ...
   ```

3. **HTTPS Only:**
   Ensure ML backend is served over HTTPS in production

## Monitoring

### Check ML Backend Logs

```bash
# View Flask logs
tail -f ml-backend.log
```

### Monitor Prediction Accuracy

Track in Firestore:
```javascript
// Log actual vs predicted
{
  predicted: "2024-02-01",
  actual: "2024-02-02",
  accuracy: 1 // days difference
}
```

## Advanced Configuration

### Adjust ML Model Parameters

Edit `period_tracker_ml.py`:

```python
model = GradientBoostingRegressor(
    n_estimators=200,  # Increase for more accuracy
    max_depth=4,       # Increase for more complexity
    learning_rate=0.05, # Decrease for more stability
    random_state=42
)
```

### Add Custom Features

```python
def compute_features(cycles):
    # Add custom features
    features = {
        'moon_phase': calculate_moon_phase(),
        'season': get_season(),
        'stress_level': get_stress_level()
    }
    return features
```

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review ML backend logs
3. Check Firestore data structure
4. Verify API endpoints are responding

## Next Steps

- [ ] Start ML backend server
- [ ] Configure environment variables
- [ ] Test with sample cycle data
- [ ] Monitor prediction accuracy
- [ ] Deploy to production (optional)

Happy predicting! 🎉
