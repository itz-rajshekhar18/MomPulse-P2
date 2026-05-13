# Anime.js Quick Reference - Period Dashboard

## What Was Added

### 🎬 Animation Locations

| Component | Animation | Effect |
|-----------|-----------|--------|
| **CycleProgressCard** | Phase Hero | Staggered fade-up of DAY, number, and badge |
| **QuickActionButtons** | Action Row | Cascading button entrance |
| **CommunityCards** | Card Reveal | Smooth card entrance with scale |
| **WeeklyStats** | Count-up | Animated number progression for stats |
| **TodaysVibe** | Message Reveal | Gentle fade-in of daily message |
| **SelfCareHack** | Content Reveal | Sparkle effect with staggered animations |

---

## Key Features

✨ **Smooth Entrance Animations**
- All elements fade in with translateY for depth
- Staggered timing creates visual flow
- easeOutQuad easing for natural motion

📊 **Count-up Animations**
- Sleep hours animate from 0 to 8.2h
- Activity minutes animate from 0 to 55m
- Next period days count up smoothly

🎯 **Strategic Timing**
- Hero animations complete in ~1 second
- Stats animations follow with slight delay
- Total page animation sequence: ~1.5 seconds

---

## How to Modify Animations

### Change Duration
```typescript
animate(element, {
  opacity: [0, 1],
  duration: 800  // Change this value (in milliseconds)
});
```

### Change Delay
```typescript
animate(element, {
  opacity: [0, 1],
  delay: 200  // Delay before animation starts
});
```

### Change Easing
```typescript
// Available options:
// 'linear', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad'
// 'easeInCubic', 'easeOutCubic', 'easeInOutCubic'
// 'easeInQuart', 'easeOutQuart', 'easeInOutQuart'
// 'easeInQuint', 'easeOutQuint', 'easeInOutQuint'
// 'easeInSine', 'easeOutSine', 'easeInOutSine'
// 'easeInExpo', 'easeOutExpo', 'easeInOutExpo'
// 'easeInCirc', 'easeOutCirc', 'easeInOutCirc'
// 'easeInElastic', 'easeOutElastic', 'easeInOutElastic'
// 'easeInBack', 'easeOutBack', 'easeInOutBack'
// 'easeInBounce', 'easeOutBounce', 'easeInOutBounce'

animate(element, {
  opacity: [0, 1],
  easing: 'easeOutCubic'  // Try different easings
});
```

### Add New Animation
```typescript
import { animate } from 'animejs';
import { useRef, useEffect } from 'react';

export default function MyComponent() {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      animate(elementRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        easing: 'easeOutQuad'
      });
    }
  }, []);

  return <div ref={elementRef}>Animated Content</div>;
}
```

---

## Animation Properties Used

| Property | Values | Purpose |
|----------|--------|---------|
| `opacity` | [0, 1] | Fade in effect |
| `translateY` | [20, 0] or [30, 0] | Slide up effect |
| `scale` | [0.8, 1] or [0.95, 1] | Grow effect |
| `duration` | 500-1000ms | Animation speed |
| `delay` | 0-400ms | Stagger timing |
| `easing` | easeOutQuad | Motion curve |

---

## Performance Tips

✅ **Do:**
- Use opacity and transform (GPU accelerated)
- Stagger animations to prevent jank
- Use reasonable durations (300-800ms)
- Test on mobile devices

❌ **Don't:**
- Animate width/height (causes reflow)
- Use too many simultaneous animations
- Make animations too long (>2 seconds)
- Animate on every render

---

## Testing Animations

1. **Open DevTools** (F12)
2. **Go to Performance tab**
3. **Record while page loads**
4. **Check for smooth 60fps**
5. **Look for no layout thrashing**

---

## Files Modified

```
components/dashboard/
├── CycleProgressCard.tsx      ✅ Hero animations
├── QuickActionButtons.tsx     ✅ Button cascade
├── CommunityCards.tsx         ✅ Card reveal
├── WeeklyStats.tsx            ✅ Count-up animations
├── TodaysVibe.tsx             ✅ Message reveal
└── SelfCareHack.tsx           ✅ Content reveal
```

---

## Troubleshooting

**Animations not showing?**
- Check if ref is properly typed: `useRef<HTMLDivElement>(null)`
- Ensure element is rendered before animation starts
- Check browser console for errors

**Animations stuttering?**
- Reduce number of simultaneous animations
- Increase duration slightly
- Check for other heavy operations on page load

**Animations too fast/slow?**
- Adjust `duration` property
- Try different `easing` functions
- Add `delay` to spread animations out

---

## Resources

- [Anime.js Documentation](https://animejs.com/)
- [Easing Functions](https://animejs.com/documentation/#easing)
- [Animation Examples](https://animejs.com/documentation/#basicUsage)

---

**Last Updated:** May 13, 2026
**Status:** ✅ Production Ready
