# 📊 Cycle Trend Chart - Visual Guide

## What You'll See

### 🎯 Header Section
```
┌─────────────────────────────────────────────────────────────┐
│  Cycle Trend                          [Day View] [Month View]│
│  Past 6 months cycle comparison                              │
└─────────────────────────────────────────────────────────────┘
```

### 📊 Statistics Cards (4 Cards in a Row)
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ AVG CYCLE    │ │ AVG PERIOD   │ │ TOTAL CYCLES │ │ REGULARITY   │
│    28        │ │     5        │ │     8        │ │     ✓        │
│   days       │ │    days      │ │   logged     │ │  Regular     │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
  Purple           Pink            Orange           Teal
```

### 📈 Interactive Chart
```
Days
 35 │                    ╱╲
    │                   ╱  ╲
 30 │        ╱╲        ╱    ╲
    │       ╱  ╲      ╱      ╲
 25 │      ╱    ╲    ╱        ╲
    │     ╱      ╲  ╱          ╲
 20 │────╱────────╲╱────────────╲────
    │
 15 │
    │
 10 │    ═══════════════════════════
    │   ═══════════════════════════
  5 │  ═══════════════════════════
    │ ═══════════════════════════
  0 └─────────────────────────────────
     JUL  AUG  SEP  OCT  NOV  DEC

     ─── Cycle Length (Purple)
     ═══ Period Length (Pink)
```

### 💡 Legend Section
```
┌─────────────────────────────────────────────────────────────┐
│ ● Cycle Length                                               │
│   Days from period start to next period start                │
│   (typical: 21-35 days)                                      │
│                                                               │
│ ● Period Length                                              │
│   Days of menstrual bleeding                                 │
│   (typical: 3-7 days)                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Color Coding

### Statistics Cards
- **Purple Background** (#a855f7): Cycle length stats
- **Pink Background** (#ec4899): Period length stats
- **Orange Background**: Total cycles count
- **Teal Background**: Regularity indicator

### Chart Lines
- **Purple Line with Gradient**: Cycle length trend
- **Pink Line with Gradient**: Period length trend
- **Light Grid**: Background reference lines

---

## 🖱️ Interactive Features

### Hover Tooltip
When you hover over any point on the chart:
```
┌─────────────────────────┐
│  Aug 15                 │
│  ─────────────────────  │
│  Cycle Length: 28 days  │
│  Period Length: 5 days  │
│  Flow: Medium           │
│  Symptoms: 3            │
└─────────────────────────┘
```

### View Toggle Buttons
```
┌──────────┐ ┌────────────┐
│ Day View │ │ Month View │  ← Click to switch
└──────────┘ └────────────┘
   Active       Inactive
  (Purple)      (Gray)
```

---

## 📱 Responsive Design

### Desktop (Large Screen)
```
┌─────────────────────────────────────────────────────────────┐
│  [Header]                                    [View Buttons]  │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                               │
│  │Stat│ │Stat│ │Stat│ │Stat│  ← 4 cards in a row          │
│  └────┘ └────┘ └────┘ └────┘                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                       │   │
│  │              [Large Chart Area]                      │   │
│  │                                                       │   │
│  └─────────────────────────────────────────────────────┘   │
│  [Legend]                                                    │
└─────────────────────────────────────────────────────────────┘
```

### Mobile (Small Screen)
```
┌─────────────────────┐
│  [Header]           │
│  [View Buttons]     │
│  ┌────┐ ┌────┐     │
│  │Stat│ │Stat│     │ ← 2 cards per row
│  └────┘ └────┘     │
│  ┌────┐ ┌────┐     │
│  │Stat│ │Stat│     │
│  └────┘ └────┘     │
│  ┌─────────────┐   │
│  │             │   │
│  │   [Chart]   │   │
│  │             │   │
│  └─────────────┘   │
│  [Legend]           │
└─────────────────────┘
```

---

## 🎭 States

### Empty State (No Cycles)
```
┌─────────────────────────────────────────────────────────────┐
│  Cycle Trend                          [Day View] [Month View]│
│  Past 6 months cycle comparison                              │
│                                                               │
│                        📊                                     │
│                                                               │
│                  No cycle data yet                           │
│              Log your cycles to see trends                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Loading State
```
┌─────────────────────────────────────────────────────────────┐
│  Cycle Trend                          [Day View] [Month View]│
│  Past 6 months cycle comparison                              │
│                                                               │
│                        ⏳                                     │
│                   Loading chart...                           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### With Data (Normal State)
```
┌─────────────────────────────────────────────────────────────┐
│  Cycle Trend                          [Day View] [Month View]│
│  Past 6 months cycle comparison                              │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                               │
│  │ 28 │ │ 5  │ │ 8  │ │ ✓  │                               │
│  └────┘ └────┘ └────┘ └────┘                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [Beautiful gradient area chart with data points]    │   │
│  └─────────────────────────────────────────────────────┘   │
│  [Legend with explanations]                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Data Points Explained

### Example Cycle Data
```
Cycle 1: Jan 1 - Jan 5 (5 days period)
Cycle 2: Jan 29 - Feb 3 (5 days period, 28 days cycle)
Cycle 3: Feb 27 - Mar 3 (5 days period, 29 days cycle)
Cycle 4: Mar 28 - Apr 1 (5 days period, 29 days cycle)
```

### What Gets Plotted
```
Point 1: Jan 1
  - Period Length: 5 days ✓
  - Cycle Length: 28 days ✓

Point 2: Jan 29
  - Period Length: 5 days ✓
  - Cycle Length: 29 days ✓

Point 3: Feb 27
  - Period Length: 5 days ✓
  - Cycle Length: 29 days ✓

Point 4: Mar 28
  - Period Length: 5 days ✓
  - Cycle Length: N/A (no next cycle yet)
```

---

## 💡 Insights You Can Gain

### 1. Cycle Regularity
```
Regular Pattern:
28 → 28 → 29 → 28 → 28 → 29
└─ Consistent, predictable

Irregular Pattern:
25 → 32 → 28 → 35 → 26 → 31
└─ Variable, less predictable
```

### 2. Period Length Changes
```
Stable:
5 → 5 → 5 → 5 → 5 → 5
└─ Consistent flow duration

Changing:
3 → 5 → 7 → 5 → 6 → 4
└─ Variable flow duration
```

### 3. Trends Over Time
```
Getting Longer:
26 → 27 → 28 → 29 → 30 → 31
└─ Cycles increasing

Getting Shorter:
32 → 31 → 30 → 29 → 28 → 27
└─ Cycles decreasing
```

---

## 🎨 Visual Hierarchy

### Priority 1: Statistics Cards
- Large numbers
- Bold text
- Colored backgrounds
- Immediate attention

### Priority 2: Chart
- Main visual element
- Interactive
- Gradient fills
- Smooth lines

### Priority 3: Legend
- Educational
- Reference information
- Smaller text
- Bottom of component

---

## 🔍 Details

### Chart Specifications
- **Width**: 100% (responsive)
- **Height**: 320px (h-80)
- **Margins**: Top: 10px, Right: 30px, Left: 0, Bottom: 0
- **Grid**: Dashed lines (#f0f0f0)
- **Line Width**: 3px
- **Gradient Opacity**: 30% at top, 0% at bottom

### Typography
- **Title**: 2xl, bold, gray-900
- **Subtitle**: sm, gray-500
- **Stats Numbers**: 2xl, bold
- **Stats Labels**: xs, uppercase, tracking-wide
- **Legend**: sm, gray-600

---

## ✨ Animations

### On Load
```
Fade in + Slide up
Duration: 0.5s
Easing: ease-out
```

### On Hover (Tooltip)
```
Instant appearance
Smooth follow cursor
```

### View Toggle
```
Button color transition
Duration: 0.2s
```

---

## 📊 Example Scenarios

### Scenario 1: Regular Cycles
```
Stats: 28 days avg, 5 days period, Regular ✓
Chart: Smooth, consistent lines
Insight: "Your cycles are very regular!"
```

### Scenario 2: Irregular Cycles
```
Stats: 30 days avg, 5 days period, Variable ~
Chart: Jagged, varying lines
Insight: "Your cycles vary by 5-7 days"
```

### Scenario 3: Short Cycles
```
Stats: 24 days avg, 4 days period, Variable ~
Chart: Lower cycle line, short period line
Insight: "Cycles shorter than typical range"
```

### Scenario 4: Long Cycles
```
Stats: 35 days avg, 6 days period, Variable ~
Chart: Higher cycle line, longer period line
Insight: "Cycles longer than typical range"
```

---

## 🎉 Summary

The Cycle Trend Chart provides:
- ✅ **Visual clarity** - Easy to understand at a glance
- ✅ **Detailed insights** - Hover for more information
- ✅ **Pattern recognition** - Spot trends quickly
- ✅ **Educational** - Learn about your body
- ✅ **Professional** - Share with healthcare providers
- ✅ **Beautiful** - Matches app design perfectly

**Result**: A powerful tool for understanding menstrual health! 📊✨
