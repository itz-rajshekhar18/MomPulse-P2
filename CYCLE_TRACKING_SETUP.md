# Cycle Tracking with ML Predictions - Setup Complete ✅

## Overview

The MomPulse app now features ML-powered period tracking with a beautiful onboarding flow. When users first visit the Insights page or Pre-Pregnancy Dashboard, they'll see a blurred interface with a popup prompting them to log their first cycle.

## User Experience Flow

### 1. First Visit (No Cycle Data)
- **Insights Page** or **Pre-Pregnancy Dashboard** shows blurred content
- **Popup appears** with:
  - Icon (calendar in purple gradient circle)
  - Title: "Start Tracking Your Cycle"
  - Description: "Log your period cycle to unlock ML-powered predictions..."
  - Button: "Log Your First Cycle"

### 2. Cycle Logging Modal
When user clicks "Log Your First Cycle", a beautiful modal opens with:

**Fields:**
- **Period Start Date*** (required)
- **Period End Date*** (required)
- **Flow Intensity** (Light/Medium/Heavy buttons)
- **Symptoms** (optional pills: Cramps, Fatigue, Headache, Mood Swings, Bloating, Back Pain, Breast Tenderness, Nausea)
- **Notes** (optional textarea)

**Actions:**
- Cancel button (gray)
- Save Cycle button (purple gradient)

### 3. After Logging
- Modal closes
- Blur effect removed
- Full dashboard/insights visible
- ML predictions start working

## Technical Implementation

### Components Created

1. **CycleLogModal** (`components/insights/CycleLogModal.tsx`)
   - Beautiful modal with gradient header
   - Form validation
   - Saves to Firestore
   - Success callback

### Pages Updated

1. **Insights Page** (`app/insights/page.tsx`)
   - Checks for cycle data on load
   - Shows blur + popup if no data
   - Imports CycleLogModal

2. **Pre-Pregnancy Dashboard** (`app/dashboard/pre-pregnancy/page.tsx`)
   - Same blur + popup behavior
   - Integrated with existing animations

### Data Flow

```
User clicks "Log Your First Cycle"
         ↓
Modal opens with form
         ↓
User fills in cycle data
         ↓
Click "Save Cycle"
         ↓
saveCycleData() → Firestore
         ↓
Modal closes, page refetches
         ↓
hasCycleData = true
         ↓
Blur removed, content visible
         ↓
ML predictions available
```

## Firestore Data Structure

```typescript
users/{userId}/cycles/{cycleId}
{
  start_date: "2024-01-01",
  end_date: "2024-01-05",
  symptoms: ["Cramps", "Fatigue"],
  flow_intensity: "medium",
  notes: "Normal cycle",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## ML Predictions

Once user has logged cycles, they can:

1. **View Predictions:**
   - Next period start/end dates
   - Ovulation date
   - Fertile window
   - Cycle regularity
   - Confidence level

2. **Get Insights:**
   - Average cycle length analysis
   - Regularity assessment
   - Period duration insights
   - Trend detection
   - Symptom patterns

## How to Test

### 1. Start the App
```bash
npm run dev
```

### 2. Start ML Backend
```bash
cd ml-backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python period_tracker_ml.py
```

### 3. Test Flow
1. Login to the app
2. Navigate to Insights page or Pre-Pregnancy Dashboard
3. See blurred content with popup
4. Click "Log Your First Cycle"
5. Fill in cycle data:
   - Start: 2024-01-01
   - End: 2024-01-05
   - Flow: Medium
   - Symptoms: Cramps, Fatigue
6. Click "Save Cycle"
7. See blur removed
8. Content now visible

### 4. Add More Cycles
To get better predictions, add more cycles:
- Log at least 3 cycles for "medium" confidence
- Log 6+ cycles for "high" confidence

## Features

### Visual Design
✅ Gradient purple-pink theme
✅ Smooth blur effect
✅ Animated modal entrance
✅ Responsive design (mobile/tablet/desktop)
✅ Beautiful form with pill buttons
✅ Loading states
✅ Error handling

### Functionality
✅ Form validation (dates required)
✅ Date range validation (end > start)
✅ Multiple symptom selection
✅ Flow intensity selection
✅ Optional notes field
✅ Saves to Firestore
✅ Refetches data after save
✅ Removes blur automatically

### User Experience
✅ Clear call-to-action
✅ Helpful descriptions
✅ Easy-to-use form
✅ Instant feedback
✅ Smooth animations
✅ Accessible design

## Customization

### Change Symptoms List
Edit `CycleLogModal.tsx`:
```typescript
const symptomOptions = [
  'Cramps',
  'Fatigue',
  'Headache',
  // Add more symptoms here
];
```

### Change Flow Intensity Options
Edit `CycleLogModal.tsx`:
```typescript
{(['light', 'medium', 'heavy'] as const).map((intensity) => (
  // Add more intensity levels if needed
))}
```

### Change Popup Message
Edit `app/insights/page.tsx` or `app/dashboard/pre-pregnancy/page.tsx`:
```typescript
<h2>Start Tracking Your Cycle</h2>
<p>Your custom message here...</p>
```

## Security

### Firestore Rules
```
match /users/{userId}/cycles/{cycleId} {
  allow read: if isAuthenticated() && isOwner(userId);
  allow create: if isAuthenticated() && isOwner(userId);
  allow update: if isAuthenticated() && isOwner(userId);
  allow delete: if isAuthenticated() && isOwner(userId);
}
```

Users can only access their own cycle data.

## Future Enhancements

1. **Edit Cycles**
   - Add edit button to cycle history
   - Update existing cycles

2. **Delete Cycles**
   - Add delete button
   - Confirm before deleting

3. **Cycle History View**
   - Show all logged cycles
   - Calendar visualization
   - Timeline view

4. **Quick Add**
   - "Add Another Cycle" button
   - Faster logging for multiple cycles

5. **Import Data**
   - Import from other apps
   - CSV upload
   - Manual bulk entry

6. **Reminders**
   - Remind to log period
   - Predict next period reminder
   - Fertile window notifications

## Troubleshooting

### Blur Not Removing
- Check browser console for errors
- Verify Firestore rules are deployed
- Check that `getUserCycles()` is working

### Modal Not Opening
- Check that `showModal` state is updating
- Verify `CycleLogModal` is imported
- Check for JavaScript errors

### Data Not Saving
- Verify Firestore connection
- Check authentication status
- Review Firestore rules
- Check browser console for errors

### ML Predictions Not Working
- Ensure Flask backend is running
- Check `ML_BACKEND_URL` in `.env`
- Verify at least 1 cycle is logged
- Check API route logs

## Support

For issues:
1. Check browser console for errors
2. Review Firestore logs
3. Check Flask backend logs
4. Verify environment variables
5. Test with sample data

## Success! 🎉

The cycle tracking onboarding is now complete. Users will have a smooth, beautiful experience logging their first cycle and unlocking ML-powered predictions!
