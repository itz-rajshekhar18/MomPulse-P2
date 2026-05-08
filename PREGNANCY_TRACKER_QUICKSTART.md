# Pregnancy Tracker - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Train the ML Model (One-time setup)

```bash
cd mompulse
python3 ml-backend/pregnancy_wellness_ml.py
```

**Expected Output**:
```
───────────────────────────────────────────────────────────
  Pregnancy Wellness ML Model  ·  scikit-learn
───────────────────────────────────────────────────────────

[1/5] Generating synthetic dataset …
      Total samples: 50000+
[2/5] Normalising features …
      Train: 42000+  │  Test: 7000+

[3/5] Training risk classifier (MLPClassifier) …

  Risk Classifier — Test Set Report:
              precision    recall  f1-score   support

     Thriving       0.99      0.99      0.99      3500
Moderate Concern    0.98      0.98      0.98      2500
Needs Attention     0.99      0.99      0.99      1000

[4/5] Training wellness regressor (MLPRegressor) …
  Wellness Regressor → MAE: 2.5 pts  │  R²: 0.98

[5/5] Exporting model weights to public/pregnancy_model.json …
      Saved → public/pregnancy_model.json  (250 KB)

────────────────────────────
  Training complete ✓
  Classifier accuracy : 98.5%
  Regressor MAE       : 2.5 pts
  Regressor R²        : 0.98
────────────────────────────
```

### Step 2: Test the API

```bash
# Start your Next.js dev server
npm run dev

# In another terminal, test the API
curl -X POST http://localhost:3000/api/ml/pregnancy-wellness \
  -H "Content-Type: application/json" \
  -d '{
    "week": 20,
    "energy": 7,
    "sleep": 8,
    "symptom_count": 2,
    "water_pct": 80,
    "diet_pct": 75
  }'
```

**Expected Response**:
```json
{
  "wellness_score": 72.5,
  "risk_level": "Thriving",
  "risk_class": 0,
  "recommendations": [
    "Great job! Keep up your healthy habits",
    "Second trimester: Maintain calcium and protein intake for baby's growth",
    "Continue monitoring your wellness patterns"
  ],
  "insights": {
    "energy_status": "Good",
    "sleep_status": "Optimal",
    "hydration_status": "Excellent",
    "diet_status": "Good",
    "symptom_status": "Minimal"
  }
}
```

### Step 3: Use in Your React Components

```typescript
import { usePregnancyWellness } from '@/lib/usePregnancyWellness';
import { savePregnancyLog } from '@/lib/firestore';

function PregnancyDashboard() {
  const { user } = useAuth();
  const { predict, prediction, loading } = usePregnancyWellness();

  const handleLogSubmit = async (formData) => {
    // Get ML prediction
    const result = await predict({
      week: formData.week,
      energy: formData.energy,
      sleep: formData.sleep,
      symptom_count: formData.symptoms.length,
      water_pct: formData.waterIntake,
      diet_pct: formData.dietAdherence,
    });

    // Save to Firestore (includes ML predictions)
    if (user && result) {
      await savePregnancyLog(user.uid, {
        week: formData.week,
        energy: formData.energy,
        sleep: formData.sleep,
        symptom_count: formData.symptoms.length,
        symptoms: formData.symptoms,
        water_pct: formData.waterIntake,
        diet_pct: formData.dietAdherence,
        trimester: Math.ceil(formData.week / 13.33),
        wellness_score: result.wellness_score,
        risk_level: result.risk_level,
        risk_class: result.risk_class,
        notes: formData.notes,
      });
    }
  };

  return (
    <div>
      {loading && <p>Analyzing your wellness...</p>}
      {prediction && (
        <div className="wellness-card">
          <h2>Wellness Score: {prediction.wellness_score}/100</h2>
          <p>Status: {prediction.risk_level}</p>
          <ul>
            {prediction.recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

## 📊 Example Use Cases

### 1. Daily Wellness Tracking
```typescript
import { savePregnancyLog, getLatestPregnancyLog } from '@/lib/firestore';

// Save today's log
await savePregnancyLog(userId, {
  week: 24,
  energy: 8,
  sleep: 7.5,
  symptom_count: 1,
  symptoms: ['back pain'],
  water_pct: 90,
  diet_pct: 85,
  trimester: 2,
  notes: 'Feeling energetic today!',
});

// Get latest log
const latestLog = await getLatestPregnancyLog(userId);
console.log('Latest wellness score:', latestLog?.wellness_score);
```

### 2. Weekly Trends
```typescript
import { getPregnancyLogsByWeekRange } from '@/lib/firestore';

// Get logs for weeks 20-24
const logs = await getPregnancyLogsByWeekRange(userId, 20, 24);

// Calculate average wellness
const avgWellness = logs.reduce((sum, log) => 
  sum + (log.wellness_score || 0), 0) / logs.length;

console.log('Average wellness (weeks 20-24):', avgWellness);
```

### 3. Trimester Analysis
```typescript
import { getPregnancyLogsByTrimester, getPregnancyStats } from '@/lib/firestore';

// Get all second trimester logs
const secondTrimesterLogs = await getPregnancyLogsByTrimester(userId, 2);

// Get overall statistics
const stats = await getPregnancyStats(userId);
console.log('Most common symptoms:', stats.mostCommonSymptoms);
console.log('Risk distribution:', stats.riskDistribution);
```

## 🎨 UI Component Examples

### Wellness Score Card
```tsx
function WellnessScoreCard({ score, riskLevel }) {
  const getColor = (level) => {
    if (level === 'Thriving') return 'bg-green-500';
    if (level === 'Moderate Concern') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Wellness Score</h3>
      <div className="flex items-center gap-4">
        <div className="text-5xl font-bold text-purple-600">
          {score}
        </div>
        <div className="flex-1">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full ${getColor(riskLevel)}`}
              style={{ width: `${score}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-600">{riskLevel}</p>
        </div>
      </div>
    </div>
  );
}
```

### Daily Log Form
```tsx
function DailyLogForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    week: 20,
    energy: 5,
    sleep: 7,
    symptoms: [],
    waterIntake: 50,
    dietAdherence: 50,
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
      <div className="space-y-4">
        <label>
          Energy Level (1-10)
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={formData.energy}
            onChange={(e) => setFormData({...formData, energy: +e.target.value})}
          />
          <span>{formData.energy}</span>
        </label>

        <label>
          Sleep Hours
          <input 
            type="number" 
            min="0" 
            max="12" 
            step="0.5"
            value={formData.sleep}
            onChange={(e) => setFormData({...formData, sleep: +e.target.value})}
          />
        </label>

        <label>
          Hydration (%)
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={formData.waterIntake}
            onChange={(e) => setFormData({...formData, waterIntake: +e.target.value})}
          />
          <span>{formData.waterIntake}%</span>
        </label>

        <label>
          Diet Adherence (%)
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={formData.dietAdherence}
            onChange={(e) => setFormData({...formData, dietAdherence: +e.target.value})}
          />
          <span>{formData.dietAdherence}%</span>
        </label>

        <button type="submit" className="btn-primary">
          Log Today's Data
        </button>
      </div>
    </form>
  );
}
```

## 🔧 Troubleshooting

### Model file not found
```bash
# Make sure you ran the training script
python3 ml-backend/pregnancy_wellness_ml.py

# Check if file exists
ls -lh public/pregnancy_model.json
```

### API returns 500 error
```bash
# Check Next.js logs
npm run dev

# Test with curl
curl -X GET http://localhost:3000/api/ml/pregnancy-wellness
```

### Firestore permission denied
```bash
# Make sure you deployed the firestore rules
# Go to Firebase Console → Firestore → Rules
# Copy content from mompulse/firestore.rules
# Click Publish
```

### TypeScript errors
```bash
# Rebuild the project
npm run build

# Check for type errors
npx tsc --noEmit
```

## 📚 Additional Resources

- **Full Documentation**: `PREGNANCY_ML_INTEGRATION.md`
- **API Reference**: `app/api/ml/pregnancy-wellness/route.ts`
- **Firestore Functions**: `lib/firestore.ts` (search for "Pregnancy Tracking")
- **React Hook**: `lib/usePregnancyWellness.ts`
- **Training Script**: `ml-backend/pregnancy_wellness_ml.py`

## 🎯 Next Steps

1. **Create Pregnancy Dashboard Page**
   - Copy structure from `app/dashboard/period/page.tsx`
   - Add daily logging form
   - Display wellness trends
   - Show recommendations

2. **Add Visualizations**
   - Install chart library: `npm install recharts`
   - Create wellness score chart
   - Add energy/sleep trends
   - Show symptom frequency

3. **Implement Notifications**
   - Daily log reminders
   - Risk level alerts
   - Milestone celebrations

4. **Test with Real Users**
   - Collect feedback
   - Monitor prediction accuracy
   - Adjust recommendations

---

**Ready to build amazing pregnancy tracking features!** 🚀
