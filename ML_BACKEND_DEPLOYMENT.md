# ML Backend Deployment Configuration

## Production URL
The ML backend is now deployed at: **https://mompulse-p2-2.onrender.com**

## Updated Files

### API Routes (Updated to use production URL)
1. `app/api/ml/predict/route.ts` - Period prediction endpoint
2. `app/api/ml/insights/route.ts` - Cycle insights endpoint
3. `app/api/ml/period-prediction/route.ts` - Period prediction with Firestore integration

### Environment Files
1. `.env` - Updated with production URL
2. `.env.example` - Updated with production URL
3. `.env.local.example` - Added ML_BACKEND_URL configuration

### ML Backend Files
1. `ml-backend/period_tracker_ml.py` - Configured for Render deployment
2. `ml-backend/render.yaml` - Render deployment configuration
3. `ml-backend/runtime.txt` - Python 3.11.9 specification
4. `ml-backend/.python-version` - Python version file
5. `ml-backend/requirements.txt` - Updated package versions

## Environment Variable

All API routes now use:
```typescript
const ML_BACKEND_URL = process.env.ML_BACKEND_URL || 'https://mompulse-p2-2.onrender.com';
```

This means:
- If `ML_BACKEND_URL` is set in environment variables, it will use that
- Otherwise, it defaults to the production Render URL
- For local development, set `ML_BACKEND_URL=http://localhost:5050` in your `.env.local`

## API Endpoints Available

### 1. Health Check
- **URL**: `https://mompulse-p2-2.onrender.com/api/health`
- **Method**: GET
- **Response**: `{"status": "ok"}`

### 2. Predict Next Cycle
- **URL**: `https://mompulse-p2-2.onrender.com/api/predict`
- **Method**: POST
- **Body**: `{"cycles": [...]}`
- **Response**: Prediction data with next period dates, ovulation, fertile window

### 3. Get Insights
- **URL**: `https://mompulse-p2-2.onrender.com/api/insights`
- **Method**: POST
- **Body**: `{"cycles": [...]}`
- **Response**: Array of insights based on cycle data

## Testing

Test the ML backend health:
```bash
curl https://mompulse-p2-2.onrender.com/api/health
```

Expected response:
```json
{"status": "ok"}
```

## Local Development

To use local ML backend during development:
1. Start the local Flask server: `python ml-backend/period_tracker_ml.py`
2. Set in `.env.local`: `ML_BACKEND_URL=http://localhost:5050`
3. The app will use your local backend instead of production

## Deployment Notes

- The ML backend uses Python 3.11.9 for package compatibility
- Deployed on Render's free tier
- Automatically scales and handles requests
- CORS is enabled for cross-origin requests from the Next.js frontend
