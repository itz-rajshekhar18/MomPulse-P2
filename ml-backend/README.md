# Period Tracker ML Backend

This is the Flask backend for the MomPulse period tracking ML model.

## Setup

1. Install Python 3.8 or higher
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Server

```bash
python period_tracker_ml.py
```

The server will run on `http://localhost:5050`

## API Endpoints

### POST /api/predict
Predict next cycle based on provided cycle data.

**Request Body:**
```json
{
  "cycles": [
    {
      "start_date": "2024-01-01",
      "end_date": "2024-01-05",
      "symptoms": ["cramps", "fatigue"],
      "flow_intensity": "medium",
      "notes": "Normal cycle"
    }
  ]
}
```

**Response:**
```json
{
  "next_period_start": "2024-01-29",
  "next_period_end": "2024-02-02",
  "predicted_cycle_length": 28,
  "ovulation_date": "2024-01-15",
  "fertile_window_start": "2024-01-10",
  "fertile_window_end": "2024-01-16",
  "avg_cycle_length": 28.0,
  "avg_period_duration": 5,
  "cycle_regularity": "very regular",
  "confidence": "high",
  "data_points": 6
}
```

### POST /api/insights
Generate insights based on cycle data.

**Request Body:**
```json
{
  "cycles": [...]
}
```

**Response:**
```json
{
  "insights": [
    {
      "type": "info",
      "text": "Your average cycle length is 28 days, which is within the normal range."
    }
  ]
}
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```
