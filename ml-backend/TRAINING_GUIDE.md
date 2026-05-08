# MomPulse ML Training Guide 🤰

Complete guide for training all machine learning models in the MomPulse application.

## Overview

MomPulse uses two main ML models:

1. **Pregnancy Wellness Model** - Predicts wellness scores and risk levels for pregnant users
2. **Period Tracker Model** - Predicts next period dates and cycle patterns

## Quick Start

### Option 1: Using the Main Training Script (Recommended)

**Linux/Mac:**
```bash
cd ml-backend
bash train.sh
```

**Windows:**
```cmd
cd ml-backend
train.bat
```

**Direct Python:**
```bash
python3 ml-backend/train_all_models.py
```

### Option 2: Train Individual Models

**Pregnancy Wellness Model:**
```bash
python3 ml-backend/pregnancy_wellness_ml.py
```

**Period Tracker Model:**
```bash
# Period tracker trains on-demand via Flask API
# For validation, use the main training script
python3 ml-backend/train_all_models.py
```

## Requirements

### Python Version
- Python 3.8 or higher

### Dependencies
```
scikit-learn>=1.3.0
numpy>=1.24.0
pandas>=2.0.0
flask>=2.3.0
flask-cors>=4.0.0
```

Install all dependencies:
```bash
pip install -r ml-backend/requirements.txt
```

### Virtual Environment (Recommended)

**Create virtual environment:**
```bash
cd ml-backend
python3 -m venv venv
```

**Activate virtual environment:**

Linux/Mac:
```bash
source venv/bin/activate
```

Windows:
```cmd
venv\Scripts\activate
```

**Install dependencies:**
```bash
pip install -r requirements.txt
```

## Model Details

### 1. Pregnancy Wellness Model

**File:** `pregnancy_wellness_ml.py`

**Architecture:**
- Two-headed neural network (MLPClassifier + MLPRegressor)
- Shared input features (7 features)
- Risk classifier: 3 classes (Thriving, Moderate Concern, Needs Attention)
- Wellness scorer: Continuous score 0-100

**Input Features:**
1. `week` - Pregnancy week (1-40)
2. `energy` - Energy level (1-10)
3. `sleep` - Sleep hours (0-12)
4. `symptom_count` - Number of symptoms (0-12)
5. `water_pct` - Hydration percentage (0-100)
6. `diet_pct` - Diet adherence percentage (0-100)
7. `trimester` - Current trimester (1-3)

**Output:**
- `pregnancy_model.json` - Exported to `public/` directory
- Contains model weights, architecture, and scaler parameters
- Used for client-side inference in React app

**Training Data:**
- ~30,000 synthetic samples
- Evidence-based wellness scoring rules
- Covers all pregnancy weeks and health scenarios

**Performance Metrics:**
- Classifier accuracy: ~95%
- Regressor MAE: ~3-5 points
- Regressor R²: ~0.95

### 2. Period Tracker Model

**File:** `period_tracker_ml.py`

**Architecture:**
- GradientBoostingRegressor
- Predicts next cycle length based on historical data
- Dynamic training per user

**Input Features:**
- Recent cycle lengths (rolling window)
- Cycle length statistics (mean, std, range)
- Historical period durations

**Output:**
- Trains on-demand via Flask API
- No static model file (user-specific)
- `period_model_info.json` - Validation info only

**Training Data:**
- User-specific cycle history
- Minimum 2 cycles required
- Optimal: 6+ cycles for high confidence

**Predictions:**
- Next period start date
- Next period end date
- Ovulation date
- Fertile window
- Cycle regularity assessment

## Training Pipeline

The `train_all_models.py` script runs both models in sequence:

```
1. Pregnancy Wellness Model
   ├── Generate synthetic dataset (~30k samples)
   ├── Normalize features (MinMaxScaler)
   ├── Train/test split (85/15)
   ├── Train risk classifier (MLPClassifier)
   ├── Train wellness regressor (MLPRegressor)
   ├── Evaluate on test set
   └── Export to pregnancy_model.json

2. Period Tracker Model
   ├── Generate sample validation data
   ├── Train GradientBoostingRegressor
   ├── Validate predictions
   └── Export info to period_model_info.json
```

## Output Files

After training, the following files are generated:

```
public/
├── pregnancy_model.json       # Pregnancy wellness model (client-side)
└── period_model_info.json     # Period tracker validation info
```

### pregnancy_model.json Structure
```json
{
  "version": "1.0",
  "trained_with": "scikit-learn MLPClassifier + MLPRegressor",
  "feature_names": [...],
  "feature_ranges": {...},
  "scaler": {...},
  "classifier": {...},
  "regressor": {...},
  "metrics": {...}
}
```

## Usage in Application

### Pregnancy Wellness Model

**Frontend (React):**
```typescript
import { usePregnancyWellness } from '@/lib/usePregnancyWellness';

const { predict, loading, error } = usePregnancyWellness();

const result = await predict({
  week: 24,
  energy: 7,
  sleep: 8,
  symptom_count: 2,
  water_pct: 80,
  diet_pct: 75,
  trimester: 2
});

console.log(result.wellness_score); // 0-100
console.log(result.risk_level);     // "Thriving" | "Moderate Concern" | "Needs Attention"
```

**Backend API:**
```typescript
// POST /api/ml/pregnancy-wellness
{
  "week": 24,
  "energy": 7,
  "sleep": 8,
  "symptom_count": 2,
  "water_pct": 80,
  "diet_pct": 75,
  "trimester": 2
}
```

### Period Tracker Model

**Backend API:**
```typescript
// POST /api/ml/predict
{
  "cycles": [
    {
      "start_date": "2024-01-01",
      "end_date": "2024-01-05",
      "symptoms": ["cramps"],
      "flow_intensity": "medium"
    },
    // ... more cycles
  ]
}
```

## Troubleshooting

### Common Issues

**1. Import Errors**
```
ModuleNotFoundError: No module named 'sklearn'
```
**Solution:** Install dependencies
```bash
pip install -r requirements.txt
```

**2. Permission Errors**
```
PermissionError: [Errno 13] Permission denied: 'public/pregnancy_model.json'
```
**Solution:** Check file permissions or run with appropriate privileges

**3. Memory Errors**
```
MemoryError: Unable to allocate array
```
**Solution:** Reduce dataset size or use a machine with more RAM

**4. Python Version Issues**
```
SyntaxError: invalid syntax
```
**Solution:** Ensure Python 3.8+ is installed
```bash
python3 --version
```

### Validation

**Check model files exist:**
```bash
ls -lh public/pregnancy_model.json
ls -lh public/period_model_info.json
```

**Verify model structure:**
```bash
python3 -c "import json; print(json.load(open('public/pregnancy_model.json'))['version'])"
```

**Test predictions:**
```bash
# Test pregnancy wellness model
curl -X POST http://localhost:3000/api/ml/pregnancy-wellness \
  -H "Content-Type: application/json" \
  -d '{"week":24,"energy":7,"sleep":8,"symptom_count":2,"water_pct":80,"diet_pct":75,"trimester":2}'

# Test period tracker model
curl -X POST http://localhost:10000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"cycles":[{"start_date":"2024-01-01","end_date":"2024-01-05"}]}'
```

## Retraining

Models should be retrained when:

1. **New features are added** - Update feature engineering
2. **Performance degrades** - Retrain with more data
3. **Medical guidelines change** - Update wellness scoring rules
4. **User feedback indicates issues** - Adjust model parameters

**Retraining frequency:**
- Pregnancy Wellness: Monthly or when guidelines update
- Period Tracker: Trains dynamically per user (no retraining needed)

## Performance Optimization

### Training Speed
- Use GPU acceleration (if available)
- Reduce dataset size for faster iteration
- Use early stopping to prevent overtraining

### Model Size
- Current pregnancy model: ~500 KB
- Optimize by reducing hidden layer sizes
- Use quantization for smaller file size

### Inference Speed
- Client-side inference is fast (~10ms)
- Server-side inference via Flask API
- Consider caching predictions

## Development

### Adding New Features

1. Update `FEATURE_NAMES` and `FEATURE_RANGES`
2. Modify `generate_dataset()` to include new features
3. Update wellness scoring rules if needed
4. Retrain and validate model
5. Update API endpoints and frontend hooks

### Testing

```bash
# Run training with verbose output
python3 ml-backend/train_all_models.py

# Check model metrics
python3 -c "
import json
model = json.load(open('public/pregnancy_model.json'))
print('Classifier Accuracy:', model['metrics']['classifier_accuracy'])
print('Regressor MAE:', model['metrics']['regressor_mae'])
print('Regressor R²:', model['metrics']['regressor_r2'])
"
```

## Deployment

### Production Deployment

1. **Train models locally:**
   ```bash
   python3 ml-backend/train_all_models.py
   ```

2. **Commit model files:**
   ```bash
   git add public/pregnancy_model.json
   git add public/period_model_info.json
   git commit -m "Update ML models"
   ```

3. **Deploy to production:**
   - Models are served as static files from `public/`
   - No server-side inference needed for pregnancy model
   - Period tracker runs as Flask API (separate deployment)

### CI/CD Integration

Add to your CI/CD pipeline:

```yaml
# .github/workflows/train-models.yml
name: Train ML Models

on:
  schedule:
    - cron: '0 0 1 * *'  # Monthly
  workflow_dispatch:

jobs:
  train:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      - run: pip install -r ml-backend/requirements.txt
      - run: python3 ml-backend/train_all_models.py
      - uses: actions/upload-artifact@v3
        with:
          name: ml-models
          path: public/*.json
```

## Support

For issues or questions:
- Check the troubleshooting section above
- Review model training logs
- Contact the development team

## License

Proprietary - MomPulse Application
