# 📊 Cycle Trend Chart - Complete Guide

## Overview
Beautiful, interactive cycle trend visualization that shows the past 6 months of cycle data with insights and analytics.

---

## ✨ Features

### 1. **Interactive Area Chart**
- Displays cycle length and period length trends over time
- Smooth gradient fills (purple for cycle, pink for period)
- Hover tooltips with detailed information
- Responsive design that works on all screen sizes

### 2. **View Modes**
- **Day View**: Shows specific dates (e.g., "Jan 15", "Feb 12")
- **Month View**: Shows months (e.g., "Jan", "Feb", "Mar")
- Toggle between views with buttons

### 3. **Statistics Cards**
Four key metrics displayed at the top:
- **Average Cycle Length**: Mean days between periods
- **Average Period Length**: Mean days of bleeding
- **Total Cycles**: Number of logged cycles
- **Regularity**: Indicates if cycles are regular (26-32 days)

### 4. **Smart Empty State**
- Shows helpful message when no cycles are logged
- Encourages users to log their first cycle
- Beautiful icon and clear call-to-action

### 5. **Interactive Tooltips**
Hover over any data point to see:
- Exact date
- Cycle length (days to next period)
- Period length (days of bleeding)
- Flow intensity (light/medium/heavy)
- Number of symptoms logged

### 6. **Legend & Education**
- Clear legend explaining what each line represents
- Educational notes about typical ranges
- Color-coded for easy understanding

---

## 🎨 Visual Design

### Color Scheme
- **Purple (#a855f7)**: Cycle length
- **Pink (#ec4899)**: Period length
- **Orange**: Total cycles stat
- **Teal**: Regularity stat

### Layout
- Full-width chart below the calendar
- Responsive grid for stats cards
- Clean, modern design matching app theme

---

## 📊 Data Visualization

### What Gets Plotted

#### Cycle Length (Purple Line)
- **Definition**: Days from period start to next period start
- **Calculation**: `nextCycleStartDate - currentCycleStartDate`
- **Typical Range**: 21-35 days
- **Note**: Last cycle won't have cycle length (no next cycle yet)

#### Period Length (Pink Line)
- **Definition**: Days of menstrual bleeding
- **Calculation**: `endDate - startDate + 1`
- **Typical Range**: 3-7 days
- **Always Available**: Every logged cycle has this

### Data Processing
```typescript
// Sorts cycles by date
// Takes last 6 cycles
// Calculates metrics for each cycle
// Formats dates for display
```

---

## 🔢 Statistics Explained

### 1. Average Cycle Length
```
Sum of all cycle lengths / Number of cycles with next cycle
```
- Only includes cycles that have a next cycle
- Typical: 28 days (range: 21-35 days)
- Shows "N/A" if no complete cycles

### 2. Average Period Length
```
Sum of all period lengths / Total cycles
```
- Includes all logged cycles
- Typical: 5 days (range: 3-7 days)

### 3. Total Cycles
- Simple count of all logged cycles
- Shows growth over time

### 4. Regularity
- **Regular (✓)**: Average cycle 26-32 days
- **Variable (~)**: Outside typical range
- Helps identify cycle patterns

---

## 💡 Use Cases

### For Users
1. **Track Patterns**: See if cycles are getting longer/shorter
2. **Identify Irregularities**: Spot unusual cycles quickly
3. **Predict Future**: Understand personal cycle patterns
4. **Share with Doctor**: Visual data for medical consultations
5. **Monitor Health**: Track changes over time

### For Healthcare
- Visual representation of cycle history
- Easy to spot irregularities
- Helps with diagnosis
- Tracks treatment effectiveness

---

## 🎯 User Experience

### First-Time Users
```
┌─────────────────────────────────┐
│  📊 No cycle data yet            │
│  Log your cycles to see trends   │
└─────────────────────────────────┘
```

### After Logging 1-2 Cycles
```
┌─────────────────────────────────┐
│  Avg Cycle: N/A                  │
│  Avg Period: 5 days              │
│  Total: 2 cycles                 │
│  [Simple line chart]             │
└─────────────────────────────────┘
```

### After Logging 6+ Cycles
```
┌─────────────────────────────────┐
│  Avg Cycle: 28 days              │
│  Avg Period: 5 days              │
│  Total: 8 cycles                 │
│  Regularity: Regular ✓           │
│  [Rich trend visualization]      │
└─────────────────────────────────┘
```

---

## 🛠️ Technical Details

### Component Props
```typescript
interface CycleTrendChartProps {
  cycles: CycleData[];
}

interface CycleData {
  id: string;
  start_date: string;      // YYYY-MM-DD
  end_date: string;        // YYYY-MM-DD
  symptoms: string[];
  flow_intensity: 'light' | 'medium' | 'heavy';
  notes: string;
}
```

### Dependencies
- **recharts**: Chart library
- **framer-motion**: Animations
- **React**: Component framework

### Performance
- Memoized calculations (useMemo)
- Only processes last 6 cycles
- Efficient data transformations
- Smooth animations

---

## 📍 Location

### File Path
```
mompulse/components/dashboard/CycleTrendChart.tsx
```

### Used In
```
mompulse/app/dashboard/period/calendar/page.tsx
```

### Position
- Below the main calendar grid
- Above the "Add Cycle" modal
- Full width of the page
- Part of the blurred section (requires logged cycle)

---

## 🎨 Customization Options

### Easy Customizations
1. **Change Colors**: Update gradient IDs and stroke colors
2. **Adjust Height**: Modify `h-80` class
3. **Show More Cycles**: Change `.slice(-6)` to `.slice(-12)`
4. **Add More Stats**: Add new stat cards to grid
5. **Change Chart Type**: Switch from AreaChart to LineChart or BarChart

### Example: Show 12 Months
```typescript
// Change this line:
const recentCycles = sortedCycles.slice(-6);

// To this:
const recentCycles = sortedCycles.slice(-12);
```

---

## 🧪 Testing

### Test Scenarios

#### 1. No Cycles
- ✅ Shows empty state
- ✅ Displays helpful message
- ✅ No errors

#### 2. One Cycle
- ✅ Shows period length
- ✅ No cycle length (needs 2+ cycles)
- ✅ Stats show "N/A" for cycle length

#### 3. Multiple Cycles
- ✅ Shows both lines
- ✅ Calculates averages correctly
- ✅ Regularity indicator works

#### 4. View Toggle
- ✅ Day view shows dates
- ✅ Month view shows months
- ✅ Smooth transition

#### 5. Tooltips
- ✅ Hover shows details
- ✅ All data displayed correctly
- ✅ Formatted nicely

---

## 🐛 Troubleshooting

### Chart Not Showing
1. Check if cycles are loaded: `console.log(cycles)`
2. Verify cycles have required fields
3. Check browser console for errors
4. Ensure recharts is installed

### Data Not Accurate
1. Verify date formats (YYYY-MM-DD)
2. Check cycle sorting
3. Validate calculations
4. Review data in Firestore

### Styling Issues
1. Check Tailwind classes
2. Verify responsive breakpoints
3. Test on different screen sizes
4. Check z-index conflicts

---

## 📈 Future Enhancements

### Potential Features
1. **Export Chart**: Download as PNG/PDF
2. **Compare Periods**: Overlay multiple cycles
3. **Symptom Tracking**: Add symptom intensity to chart
4. **Flow Visualization**: Show flow intensity on chart
5. **Prediction Line**: Show predicted future cycles
6. **Zoom Controls**: Zoom in/out on timeline
7. **Date Range Picker**: Custom date ranges
8. **Multiple Chart Types**: Bar, scatter, etc.
9. **Annotations**: Add notes to specific dates
10. **Share Feature**: Share chart with doctor

### Advanced Analytics
- Cycle variability score
- Trend analysis (getting longer/shorter)
- Anomaly detection
- Correlation with symptoms
- Seasonal patterns

---

## 📚 Related Documentation

- `ML_PREDICTION_INTEGRATION_COMPLETE.md` - ML predictions
- `CALENDAR_BEFORE_AFTER.md` - Calendar improvements
- `FIRESTORE_DEBUG.md` - Data debugging
- `QUICK_START_ML_PREDICTIONS.md` - Quick start guide

---

## ✅ Checklist

### Implementation
- ✅ Component created
- ✅ Added to calendar page
- ✅ Recharts installed
- ✅ TypeScript types defined
- ✅ Responsive design
- ✅ Empty state handled
- ✅ Tooltips working
- ✅ View modes implemented
- ✅ Stats calculated
- ✅ Legend added

### Testing
- ✅ No TypeScript errors
- ✅ No compilation errors
- ✅ Responsive on mobile
- ✅ Works with no data
- ✅ Works with multiple cycles
- ✅ Animations smooth
- ✅ Colors match theme

---

## 🎉 Result

A beautiful, interactive cycle trend chart that helps users:
- **Visualize** their cycle patterns
- **Understand** their body better
- **Track** changes over time
- **Share** data with healthcare providers
- **Make informed** health decisions

**Status**: ✅ COMPLETE and ready to use!

---

**Created**: April 24, 2026  
**Component**: CycleTrendChart.tsx  
**Location**: Calendar Page  
**Dependencies**: recharts, framer-motion
