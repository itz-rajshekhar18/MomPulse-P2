# 🎬 MomPulse Animation Guide

## Quick Reference: What Animates Where

### 🏠 Pre-Pregnancy Dashboard (`/dashboard/pre-pregnancy`)

```
┌─────────────────────────────────────────────────────────┐
│  🍃 Floating Leaves (Background - 8 animated leaves)    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │ 👋 Greeting Section (FadeInView)               │    │
│  │ "Good morning, Sarah 🌸"                       │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │ 🔄 FERTILITY CARD (AnimatedCard delay: 0.2s)   │    │
│  │                                                 │    │
│  │  ⭕ Cycle Circle        📊 Info      🎯 Actions │    │
│  │  • Animated SVG        • Fade-in    • Hover    │    │
│  │  • Pulse center        • Stagger    • Wiggle   │    │
│  │  • Background circles               • Scale    │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │ 💡 DAILY INSIGHT (AnimatedCard delay: 0.3s)    │    │
│  │  • Icon pulse & wiggle on hover                │    │
│  │  • Content stagger fade-in                     │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │ ❤️ HEALTH OVERVIEW (AnimatedCard delay: 0.4s)  │    │
│  │  • Metrics stagger (0.1s each)                 │    │
│  │  • Emoji pulse (different delays)              │    │
│  │  • Hover scale on each metric                  │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │ 📚 LIBRARY (AnimatedCard delay: 0.5s)          │    │
│  │  • Cards stagger up (0.1s each)                │    │
│  │  • Hover lift & scale                          │    │
│  │  • Emoji wiggle on hover                       │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │ 📅 SESSIONS (AnimatedCard delay: 0.6s)         │    │
│  │  • Slide from left                             │    │
│  │  • Avatar wiggle on hover                      │    │
│  │  • Button hover effects                        │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Component-by-Component Breakdown

### 1. **FertilityCard** - Most Animated Component

#### Background Layer
```
🔵 Purple Circle (top-right)
   └─ scale: [1, 1.2, 1] (8s loop)
   └─ rotate: [0, 90, 0]

🔴 Pink Circle (bottom-left)
   └─ scale: [1, 1.3, 1] (10s loop)
   └─ rotate: [0, -90, 0]
```

#### Cycle Circle (Left)
```
⭕ SVG Circle
   └─ Initial: scale 0.8, opacity 0
   └─ Animate: scale 1, opacity 1 (0.8s)
   └─ Progress: pathLength 0 → 1 (2s, delay 0.5s)

📍 Center Text
   └─ Initial: opacity 0, scale 0.5
   └─ Animate: opacity 1, scale 1 (delay 1s)
```

#### Quick Actions (Right)
```
✨ Ask AI Button
   └─ Hover: scale 1.05 + purple shadow
   └─ Tap: scale 0.95
   └─ Emoji: wiggle on hover

📅 Book Consultation
   └─ Hover: scale 1.05 + pink shadow
   └─ Tap: scale 0.95
   └─ Emoji: wiggle on hover

📚 Library
   └─ Hover: scale 1.05 + teal shadow
   └─ Tap: scale 0.95
   └─ Emoji: wiggle on hover

👥 Community
   └─ Hover: scale 1.05 + purple shadow
   └─ Tap: scale 0.95
   └─ Emoji: wiggle on hover
```

#### Main CTA Button
```
🔘 "View Full Cycle Analysis"
   └─ Hover: scale 1.02 + color change + shadow
   └─ Tap: scale 0.98
```

---

### 2. **DailyInsight** - Icon Focus

```
💡 Icon Container
   └─ Hover: scale 1.1 + wiggle
   └─ SVG: continuous pulse (2s loop)

📝 Content
   ├─ Badge: fade-in (delay 0.2s)
   ├─ Title: fade-in (delay 0.3s)
   └─ Text: fade-in (delay 0.4s)
```

---

### 3. **HealthOverview** - Metric Cards

```
❤️ My Health (index 0)
   ├─ Fade-in: delay 0s
   ├─ Emoji pulse: delay 0s
   └─ Hover: scale 1.1

😴 Sleep Score (index 1)
   ├─ Fade-in: delay 0.1s
   ├─ Emoji pulse: delay 0.3s
   └─ Hover: scale 1.1

🧘 Stress (index 2)
   ├─ Fade-in: delay 0.2s
   ├─ Emoji pulse: delay 0.6s
   └─ Hover: scale 1.1
```

---

### 4. **PreconceptionLibrary** - Card Grid

```
🥗 Nutrition (index 0)
   ├─ Fade-in: delay 0s, y: 20 → 0
   ├─ Hover: y: -5, scale 1.05
   └─ Emoji: wiggle on hover

💊 Supplements (index 1)
   ├─ Fade-in: delay 0.1s, y: 20 → 0
   ├─ Hover: y: -5, scale 1.05
   └─ Emoji: wiggle on hover

🧘‍♀️ Mindset (index 2)
   ├─ Fade-in: delay 0.2s, y: 20 → 0
   ├─ Hover: y: -5, scale 1.05
   └─ Emoji: wiggle on hover
```

---

### 5. **UpcomingSessions** - Session Card

```
📋 Session Card
   ├─ Slide-in: x: -20 → 0 (delay 0.2s)
   ├─ Hover: scale 1.02 + shadow
   └─ Avatar: wiggle on hover

🔘 Reserve Button
   ├─ Hover: scale 1.05 + purple shadow
   └─ Tap: scale 0.95
```

---

### 6. **FloatingLeaves** - Background Animation

```
🍃 Leaf System (8 leaves)
   ├─ Emojis: 🍃, 🌿, 🌱, 🍀, 🌾
   ├─ Position: random X (0-100%)
   ├─ Duration: 15-25s per leaf
   ├─ Motion: y: -100 → 110vh
   │          x: sine wave drift
   │          rotate: 0 → 360°
   └─ Opacity: 0 → 0.6 → 0.6 → 0
```

---

## 🎨 Animation Timing Reference

| Component | Entry Delay | Duration | Hover Duration |
|-----------|-------------|----------|----------------|
| Greeting | 0.1s | 0.6s | - |
| FertilityCard | 0.2s | 0.5s | 0.2s |
| DailyInsight | 0.3s | 0.5s | 0.5s |
| HealthOverview | 0.4s | 0.5s | 0.2s |
| Library | 0.5s | 0.5s | 0.3s |
| Sessions | 0.6s | 0.5s | 0.2s |

---

## 🎭 Animation Types Used

### Entry Animations
- ✅ Fade In (opacity: 0 → 1)
- ✅ Slide Up (y: 20 → 0)
- ✅ Slide Left (x: -20 → 0)
- ✅ Scale In (scale: 0.8 → 1)

### Hover Animations
- ✅ Scale Up (1 → 1.05)
- ✅ Lift (y: 0 → -5)
- ✅ Wiggle (rotate: 0 → -10 → 10 → -10 → 0)
- ✅ Shadow Glow

### Continuous Animations
- ✅ Pulse (scale: 1 → 1.1 → 1)
- ✅ Rotate (0° → 360°)
- ✅ Float (y + x sine wave)

### Feedback Animations
- ✅ Tap Scale (scale: 1 → 0.95)
- ✅ Color Change
- ✅ Shadow Intensity

---

## 🚀 Performance Tips

1. **GPU Acceleration**: All animations use `transform` and `opacity`
2. **Will-Change**: Framer Motion automatically adds this
3. **Reduced Motion**: Respects user preferences
4. **Lazy Loading**: Animations only run when in viewport
5. **Stagger**: Prevents all animations from running at once

---

## 🎯 User Experience Benefits

✅ **Visual Hierarchy**: Staggered animations guide attention
✅ **Feedback**: Hover/tap animations confirm interactions
✅ **Delight**: Playful emoji wiggles add personality
✅ **Professionalism**: Smooth, polished transitions
✅ **Engagement**: Continuous subtle animations keep page alive
✅ **Accessibility**: Respects prefers-reduced-motion

---

**Last Updated**: Task 7 - Animation Implementation Complete
