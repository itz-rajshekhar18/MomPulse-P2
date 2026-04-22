# Recovery ML Model Integration

## ✅ Completed

### 1. ML Models Created (`lib/recovery/`)
- **recoveryModel.ts** - Predicts recovery score (0-100) using weighted regression
- **riskModel.ts** - Classifies risk (low/medium/high) for PPD, infection, healing delays, fatigue
- **timelineModel.ts** - Generates personalized recovery milestones
- **dataGenerator.ts** - Provides expected recovery curves for vaginal/c-section deliveries

### 2. Firestore Integration (`lib/firestore.ts`)
Added functions for:
- `saveRecoveryLog()` - Save daily check-in data
- `getRecoveryLogs()` - Retrieve all recovery logs
- `getRecoveryLogByDay()` - Get specific day's log
- `updateRecoveryLog()` - Update existing log
- `deleteRecoveryLog()` - Delete log
- `getLatestRecoveryLog()` - Get most recent log
- `saveDeliveryInfo()` - Save delivery type and date
- `getDeliveryInfo()` - Get delivery information

### 3. Firestore Rules Updated
Added security rules for:
- `/users/{userId}/recoveryLogs/{logId}` - Recovery daily logs
- `/users/{userId}/postpartum/{document}` - Postpartum data including delivery info

### 4. Components Updated
- **DailyCheckIn.tsx** - Now saves data to Firestore and calculates recovery score using ML model

## 🔄 Next Steps (To Complete Integration)

### Update RecoveryTimeline Component
```typescript
// Fetch real data and calculate progress
const logs = await getRecoveryLogs(userId);
const deliveryInfo = await getDeliveryInfo(userId);
const timeline = generatePersonalizedTimeline(logs, deliveryInfo.deliveryType);
```

### Update RecoveryMetrics Component
```typescript
// Calculate from recent logs
const recentLogs = logs.slice(-7);
const avgSleep = recentLogs.reduce((s, l) => s + l.sleep, 0) / recentLogs.length;
const physicalHealing = logs[logs.length - 1].recoveryScore;
```

### Update DoctorConsultAlert Component
```typescript
// Show based on risk assessment
const riskAssessment = classifyRisk(latestLog, logs);
if (riskAssessment.level === 'high') {
  // Show alert with specific warnings
}
```

### Update WeeklyImprovement Component
```typescript
// Calculate milestones from logs
const insights = generateInsights(logs);
// Show achievements like "First 20min Walk", "RestFul Night"
```

## 📊 Data Flow

1. **User Input** → DailyCheckIn component
2. **ML Processing** → recoveryModel.predictRecoveryScore()
3. **Risk Assessment** → riskModel.classifyRisk()
4. **Save to Firestore** → saveRecoveryLog()
5. **Display** → All recovery components fetch and display data

## 🔐 Security

- All recovery data is user-scoped
- Firestore rules ensure users can only access their own data
- ML models run client-side (no sensitive data sent to servers)

## 🎯 Key Features

1. **Recovery Score** - 0-100 score calculated from multiple factors
2. **Risk Detection** - Identifies PPD, infection, healing delays, fatigue
3. **Personalized Timeline** - Compares user progress to population averages
4. **Insights** - Generates actionable insights from patterns
5. **Trend Analysis** - Tracks improvement or decline over time

## 📝 Usage Example

```typescript
// In any component
import { getRecoveryLogs, getDeliveryInfo } from '@/lib/firestore';
import { predictRecoveryScore, generateInsights } from '@/lib/recovery/recoveryModel';
import { classifyRisk } from '@/lib/recovery/riskModel';

// Fetch data
const logs = await getRecoveryLogs(userId);
const deliveryInfo = await getDeliveryInfo(userId);

// Calculate current status
const latestLog = logs[logs.length - 1];
const recoveryScore = latestLog.recoveryScore;
const riskAssessment = classifyRisk(latestLog, logs);
const insights = generateInsights(logs);

// Display
console.log(`Recovery Score: ${recoveryScore}/100`);
console.log(`Risk Level: ${riskAssessment.level}`);
console.log(`Insights:`, insights);
```
