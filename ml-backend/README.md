# MomPulse ML Backend

Machine Learning backend for period prediction and cycle analysis.

## Features

- **Period Prediction**: Predicts next period start date using Gradient Boosting Regressor
- **Ovulation Prediction**: Calculates ovulation date and fertile window
- **Cycle Analysis**: Analyzes cycle regularity and patterns
- **Insights Generation**: Provides personalized health insights based on cycle data

## Requirements

- Python 3.8 or higher
- Flask
- Flask-CORS
- NumPy
- Pandas
- scikit-learn

## Installation

### Windows

1. Double-click `start-ml-server.bat` to automatically install dependencies and start the server

### Manual Installation

```bash
pip install flask flask-cors numpy pandas scikit-learn
```

## Running the Server

### Windows
```bash
start-ml-server.bat
```

### Linux/Mac
```bash
python period_tracker_ml.py
```

The server will start on `http://localhost:5050`

## API Endpoints

### 1. Predict Next Period
**Endpoint:** `POST /api/predict`

**Request Body:**
```json
{
  "cycles": [
    {
      "start_date": "2024-01-01",
      "end_date": "2024-01-05",
      "symptoms": ["cramps", "headache"],
      "flow_intensity": "medium",
      "mood": "happy",
      "notes": "felt good"
    }
  ]
}
```

**Response:**
```json
{
  "next_period_start": "2024-02-01",
  "next_period_end": "2024-02-05",
  "predicted_cycle_length": 28,
  "ovulation_date": "2024-01-18",
  "fertile_window_start": "2024-01-13",
  "fertile_window_end": "2024-01-19",
  "avg_cycle_length": 28.0,
  "avg_period_duration": 5,
  "cycle_regularity": "very regular",
  "confidence": "high",
  "data_points": 6,
  "cycle_lengths": [28, 29, 27, 28, 28],
  "period_durations": [5, 5, 4, 5, 6]
}
```

### 2. Get Insights
**Endpoint:** `POST /api/insights`

**Request Body:**
```json
{
  "cycles": [
    {
      "start_date": "2024-01-01",
      "end_date": "2024-01-05",
      "symptoms": ["cramps"],
      "flow_intensity": "medium"
    }
  ]
}
```

**Response:**
```json
{
  "insights": [
    {
      "type": "info",
      "text": "Your average cycle length is 28 days, which is within the normal range."
    },
    {
      "type": "success",
      "text": "Your cycles are very consistent! Great for prediction accuracy."
    }
  ]
}
```

### 3. Health Check
**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "ok"
}
```

## Machine Learning Model

The backend uses a **Gradient Boosting Regressor** with the following features:

- **Window-based features**: Last 3 cycle lengths
- **Statistical features**: Mean, standard deviation, range
- **Regularization**: Prevents overfitting with limited data
- **Fallback logic**: Uses simple averages when insufficient data

### Model Parameters
- `n_estimators`: 100
- `max_depth`: 3
- `learning_rate`: 0.1
- `random_state`: 42

## Cycle Regularity Classification

- **Very Regular**: Standard deviation ≤ 2 days
- **Mostly Regular**: Standard deviation ≤ 5 days
- **Somewhat Irregular**: Standard deviation ≤ 8 days
- **Irregular**: Standard deviation > 8 days

## Confidence Levels

- **High**: 6+ logged cycles
- **Medium**: 3-5 logged cycles
- **Low**: 1-2 logged cycles

## Integration with Next.js App

The Next.js app automatically calls this ML backend when:
1. User logs a new cycle
2. User views their dashboard
3. Predictions need to be updated

If the ML backend is unavailable, the app uses a fallback calculation method.

## Troubleshooting

### Port Already in Use
If port 5050 is already in use, edit `period_tracker_ml.py` and change:
```python
app.run(port=5050, debug=True)
```

### CORS Errors
The server has CORS enabled by default. If you still face issues, check your firewall settings.

### Import Errors
Make sure all dependencies are installed:
```bash
pip install -r requirements.txt
```

## Development

To modify the ML model:
1. Edit the `train_model()` function in `period_tracker_ml.py`
2. Adjust features in `compute_features()`
3. Update prediction logic in `predict_next_cycle()`

## Production Deployment

For production, consider:
- Using Gunicorn or uWSGI instead of Flask's development server
- Adding authentication/API keys
- Implementing rate limiting
- Using a proper database for caching predictions
- Deploying to cloud services (AWS, GCP, Azure)

## License

Part of the MomPulse application.
