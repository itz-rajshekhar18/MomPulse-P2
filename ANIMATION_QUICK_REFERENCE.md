# 🎬 Animation Quick Reference Card

## 📦 Import Statements

```typescript
// Basic animation
import { motion } from 'framer-motion';

// Reusable components
import FloatingLeaves from '@/components/animations/FloatingLeaves';
import AnimatedCard from '@/components/animations/AnimatedCard';
import PulseAnimation from '@/components/animations/PulseAnimation';
import GlowEffect from '@/components/animations/GlowEffect';
import FadeInView from '@/components/animations/FadeInView';
```

---

## 🎯 Common Patterns

### 1. Fade In + Slide Up
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### 2. Hover Scale + Shadow
```typescript
<motion.button
  whileHover={{ 
    scale: 1.05,
    boxShadow: '0 10px 30px rgba(147, 51, 234, 0.3)'
  }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.2 }}
>
  Button
</motion.button>
```

### 3. Continuous Pulse
```typescript
<motion.div
  animate={{ scale: [1, 1.1, 1] }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut'
  }}
>
  Pulsing Element
</motion.div>
```

### 4. Wiggle on Hover
```typescript
<motion.div
  whileHover={{ 
    rotate: [0, -10, 10, -10, 0] 
  }}
  transition={{ duration: 0.5 }}
>
  🎯
</motion.div>
```

### 5. Staggered Children
```typescript
{items.map((item, index) => (
  <motion.div
    key={index}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    {item}
  </motion.div>
))}
```

---

## 🎨 Using Reusable Components

### FloatingLeaves (Background)
```typescript
<div className="relative">
  <FloatingLeaves />
  <div className="relative z-10">
    Your content here
  </div>
</div>
```

### AnimatedCard (Wrapper)
```typescript
<AnimatedCard delay={0.2}>
  <YourComponent />
</AnimatedCard>
```

### PulseAnimation
```typescript
<PulseAnimation>
  <div>Pulsing content</div>
</PulseAnimation>
```

### GlowEffect
```typescript
<GlowEffect color="purple">
  <button>Glowing button</button>
</GlowEffect>
```

### FadeInView (Scroll-triggered)
```typescript
<FadeInView delay={0.1} direction="up">
  <div>Appears on scroll</div>
</FadeInView>
```

---

## ⚡ Performance Tips

### ✅ DO
```typescript
// Use transform
transform: 'translateY(20px)'
transform: 'scale(1.05)'

// Use opacity
opacity: 0.5

// Use GPU-accelerated properties
<motion.div
  animate={{ x: 100, y: 50, scale: 1.2, rotate: 45 }}
/>
```

### ❌ DON'T
```typescript
// Avoid animating these
width: '100px'
height: '100px'
top: '20px'
left: '20px'
margin: '10px'
padding: '10px'
```

---

## 🎭 Timing Reference

```typescript
// Quick feedback
duration: 0.1 - 0.2

// Hover effects
duration: 0.2 - 0.5

// Entrance animations
duration: 0.5 - 0.8

// Continuous loops
duration: 2 - 10
```

---

## 🎨 Brand Colors for Shadows

```typescript
// Purple (Primary)
boxShadow: '0 10px 30px rgba(147, 51, 234, 0.3)'

// Pink (Secondary)
boxShadow: '0 10px 30px rgba(236, 72, 153, 0.2)'

// Teal (Wellness)
boxShadow: '0 10px 30px rgba(20, 184, 166, 0.2)'

// Green (Growth)
boxShadow: '0 10px 30px rgba(34, 197, 94, 0.2)'
```

---

## 🎯 Easing Functions

```typescript
// Smooth (default)
ease: 'easeInOut'

// Bouncy
ease: [0.25, 0.1, 0.25, 1]

// Linear (for continuous)
ease: 'linear'

// Spring
type: 'spring'
stiffness: 100
damping: 10
```

---

## 📱 Responsive Animations

```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={{ scale: 1.05 }}  // Desktop
  whileTap={{ scale: 0.95 }}    // Mobile
>
  Responsive element
</motion.div>
```

---

## 🎬 Animation Variants (Advanced)

```typescript
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2 }
  }
};

<motion.div
  variants={variants}
  initial="hidden"
  animate="visible"
  whileHover="hover"
>
  Content
</motion.div>
```

---

## 🔄 SVG Path Animation

```typescript
<motion.circle
  cx="50"
  cy="50"
  r="40"
  stroke="#9333EA"
  strokeWidth="8"
  fill="none"
  initial={{ pathLength: 0 }}
  animate={{ pathLength: 1 }}
  transition={{ duration: 2 }}
/>
```

---

## 🎯 Layout Animations

```typescript
<motion.div layout>
  Content that animates when layout changes
</motion.div>
```

---

## 🌟 Exit Animations

```typescript
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
>
  Content
</motion.div>
```

---

## 🎨 Gradient Animations

```typescript
<motion.div
  animate={{
    background: [
      'linear-gradient(to right, #9333EA, #ec4899)',
      'linear-gradient(to right, #ec4899, #14b8a6)',
      'linear-gradient(to right, #9333EA, #ec4899)'
    ]
  }}
  transition={{ duration: 5, repeat: Infinity }}
>
  Gradient content
</motion.div>
```

---

## 🎯 Gesture Animations

```typescript
<motion.div
  drag
  dragConstraints={{ left: 0, right: 300, top: 0, bottom: 0 }}
  whileDrag={{ scale: 1.1 }}
>
  Draggable element
</motion.div>
```

---

## 📊 Scroll Animations

```typescript
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true, margin: '-50px' }}
>
  Appears on scroll
</motion.div>
```

---

## 🎬 Orchestration

```typescript
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

---

## 🎯 Conditional Animations

```typescript
<motion.div
  animate={isActive ? { scale: 1.1 } : { scale: 1 }}
  transition={{ duration: 0.3 }}
>
  Conditional content
</motion.div>
```

---

## 🔧 Debug Mode

```typescript
// Add to see animation values
<motion.div
  animate={{ x: 100 }}
  onUpdate={(latest) => console.log(latest)}
>
  Debug element
</motion.div>
```

---

## 📚 Resources

- **Framer Motion Docs**: https://www.framer.com/motion/
- **Animation Examples**: https://www.framer.com/motion/examples/
- **Easing Functions**: https://easings.net/

---

## 🎉 Quick Copy-Paste Templates

### Button with Full Effects
```typescript
<motion.button
  className="bg-purple-600 text-white px-6 py-3 rounded-xl"
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  whileHover={{ 
    scale: 1.05,
    backgroundColor: '#7c3aed',
    boxShadow: '0 10px 30px rgba(147, 51, 234, 0.3)'
  }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.2 }}
>
  Click Me
</motion.button>
```

### Card with Hover
```typescript
<motion.div
  className="bg-white rounded-2xl p-6 shadow-sm"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={{ 
    y: -5,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
  }}
  transition={{ duration: 0.3 }}
>
  Card content
</motion.div>
```

### Icon with Pulse
```typescript
<motion.div
  className="text-4xl"
  animate={{ scale: [1, 1.2, 1] }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut'
  }}
>
  ✨
</motion.div>
```

---

**💡 Pro Tip**: Always test animations on different devices and respect `prefers-reduced-motion` for accessibility!
