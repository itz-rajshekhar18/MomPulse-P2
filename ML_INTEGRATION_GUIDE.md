# ML Period Tracker Integration Guide

This guide explains how the ML-powered period tracking system is integrated into MomPulse.

## Architecture Overview

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Next.js App   │ ───> │  Next.js API     │ ───> │  Flask ML       │
│   (Frontend)    │      │  Routes          │      │  Backend        │
└─────────────────┘      └──────────────────┘      └─────────────────┘
         │                                                    │
         │                                                    │
         v                                                    v
┌─────────────────┐                              ┌─────────────────┐
│   Firestore     │                              │  ML Models      │
│   (Cycle Data)  │                              │  (Predictions)  │
└─────────────────┘                              └─────────────────┘
```

## Components

### 1. Flask ML Backend (`ml-backend/`)

**Location:** `mompulse/ml-backend/period_tracker_ml.py`

**Purpose:** Handles ML predictions and insights generation using scikit-learn.

**Endpoints:**
- `POST /api/predict` - Predict next cycle
- `POST /api/insights` - Generate cycle insights
- `GET /api/health` - Health check

**Setup:**
```bash
cd ml-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python period_tracker_ml.py
```

The server runs on `http://localhost:5050`

### 2. Firestore Database

**Collection Structure:**
```
users/{userId}/cycles/{cycleId}
  - id: string
  - start_date: string (YYYY-MM-DD)
  - end_date: string (YYYY-MM-DD)
  - symptoms: string[]
  - flow_intensity: 'light' | 'medium' | 'heavy'
  - notes: string
  - createdAt: Timestamp
  - updatedAt: Timestamp
```

**Security Rules:**
Users can only read/write their own cycle data.

### 3. Next.js API Routes

**Location:** `mompulse/app/api/`

#### Cycle Management
- `GET /api/cycles` - Get all cycles for user
- `POST /api/cycles` - Create new cycle
- `GET /api/cycles/[cycleId]` - Get specific cycle
- `PUT /api/cycles/[cycleId]` - Update cycle
- `DELETE /api/cycles/[cycleId]` - Delete cycle

#### ML Predictions
- `POST /api/ml/predict` - Get cycle predictions
- `POST /api/ml/insights` - Get cycle insights

### 4. Firestore Functions

**Location:** `mompulse/lib/firestore.ts`

**Functions:**
- `saveCycleData()` - Save new cycle
- `getUserCycles()` - Get all user cycles
- `updateCycleData()` - Update existing cycle
- `deleteCycleData()` - Delete cycle
- `getCycleById()` - Get specific cycle

### 5. Custom Hook

**Location:** `mompulse/lib/usePeriodPrediction.ts`

**Usage:**
```typescript
import { usePeriodPrediction } from '@/lib/usePeriodPrediction';

function MyComponent() {
  const { prediction, insights, loading, error, refetch } = usePeriodPrediction();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Next Period: {prediction?.next_period_start}</h2>
      <h3>Ovulation: {prediction?.ovulation_date}</h3>
      <h3>Fertile Window: {prediction?.fertile_window_start} - {prediction?.fertile_window_end}</h3>
      
      <h4>Insights:</h4>
      {insights.map((insight, i) => (
        <div key={i} className={insight.type}>
          {insight.text}
        </div>
      ))}
    </div>
  );
}
```

## Data Flow

### Adding a Cycle

1. User enters cycle data in UI
2. Frontend calls `POST /api/cycles` with cycle data
3. Next.js API saves to Firestore
4. Firestore stores cycle data
5. Frontend refetches predictions

### Getting Predictions

1. Frontend calls `usePeriodPrediction()` hook
2. Hook fetches cycles from Firestore
3. Hook calls `POST /api/ml/predict` with cycle data
4. Next.js API forwards request to Flask backend
5. Flask ML backend:
   - Computes cycle features
   - Trains ML model (Gradient Boosting)
   - Predicts next cycle length
   - Calculates ovulation and fertile window
6. Prediction returned to frontend

### Getting Insights

1. Frontend calls `POST /api/ml/insights`
2. Next.js API forwards to Flask backend
3. Flask analyzes cycle data:
   - Average cycle length
   - Cycle regularity (std deviation)
   - Period duration
   - Trends (getting longer/shorter)
   - Symptom frequency
4. Insights returned to frontend

## ML Model Details

### Algorithm
**Gradient Boosting Regressor** (scikit-learn)
- 100 estimators
- Max depth: 3
- Learning rate: 0.1

### Features
- Last 3 cycle lengths
- Rolling mean
- Rolling standard deviation
- Range (max - min)

### Prediction Range
Predictions are clamped to 21-45 days (reasonable cycle range)

### Confidence Levels
- **High:** 6+ cycles logged
- **Medium:** 3-5 cycles logged
- **Low:** 1-2 cycles logged

### Regularity Classification
Based on standard deviation of cycle lengths:
- **Very Regular:** ≤ 2 days
- **Mostly Regular:** ≤ 5 days
- **Somewhat Irregular:** ≤ 8 days
- **Irregular:** > 8 days

## Environment Variables

Add to `.env`:
```
ML_BACKEND_URL=http://localhost:5050
```

For production, update to your deployed Flask backend URL.

## Deployment

### Flask Backend
Deploy to:
- **Heroku:** `heroku create && git push heroku main`
- **Railway:** Connect GitHub repo
- **Google Cloud Run:** `gcloud run deploy`
- **AWS Elastic Beanstalk:** `eb init && eb deploy`

### Next.js App
Already configured for Vercel/Netlify deployment.

Update `ML_BACKEND_URL` environment variable to production Flask URL.

## Testing

### Test ML Backend
```bash
curl -X POST http://localhost:5050/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "cycles": [
      {
        "start_date": "2024-01-01",
        "end_date": "2024-01-05",
        "symptoms": ["cramps"],
        "flow_intensity": "medium",
        "notes": ""
      },
      {
        "start_date": "2024-01-29",
        "end_date": "2024-02-02",
        "symptoms": ["fatigue"],
        "flow_intensity": "medium",
        "notes": ""
      }
    ]
  }'
```

### Test Next.js API
```bash
curl -X POST http://localhost:3000/api/ml/predict \
  -H "Content-Type: application/json" \
  -d '{
    "cycles": [...]
  }'
```

## Usage in Components

### Example: Fertility Card with ML Predictions

```typescript
import { usePeriodPrediction } from '@/lib/usePeriodPrediction';

export default function FertilityCard() {
  const { prediction, loading } = usePeriodPrediction();

  if (loading) return <Spinner />;

  return (
    <div>
      <h3>Next Ovulation: {prediction?.ovulation_date}</h3>
      <p>Fertile Window: {prediction?.fertile_window_start} to {prediction?.fertile_window_end}</p>
      <p>Cycle Regularity: {prediction?.cycle_regularity}</p>
      <p>Confidence: {prediction?.confidence}</p>
    </div>
  );
}
```

## Troubleshooting

### ML Backend Not Running
```bash
cd ml-backend
python period_tracker_ml.py
```

### CORS Errors
Ensure Flask-CORS is installed and configured in `period_tracker_ml.py`

### Prediction Errors
- Check that cycles have valid date formats (YYYY-MM-DD)
- Ensure at least 1 cycle is logged
- Check Flask backend logs for errors

### Firestore Permission Errors
Deploy updated Firestore rules:
```bash
firebase deploy --only firestore:rules
```

## Future Enhancements

1. **Symptom Correlation Analysis**
   - Predict symptoms based on cycle phase
   - Identify patterns in symptom occurrence

2. **Fertility Score**
   - Calculate daily fertility probability
   - Provide conception recommendations

3. **Cycle Anomaly Detection**
   - Alert users to unusual cycles
   - Suggest medical consultation when needed

4. **Multi-Model Ensemble**
   - Combine multiple ML models
   - Improve prediction accuracy

5. **Personalized Recommendations**
   - Diet and exercise suggestions
   - Stress management tips based on cycle phase
