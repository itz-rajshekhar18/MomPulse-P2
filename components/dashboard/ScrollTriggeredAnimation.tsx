'use client';

import { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';

interface ScrollTriggeredAnimationProps {
  children: React.ReactNode;
  onVisible?: () => void;
  threshold?: number;
  duration?: number;
  delay?: number;
}

export default function ScrollTriggeredAnimation({
  children,
  onVisible,
  threshold = 0.3,
  duration = 600,
  delay = 0
}: ScrollTriggeredAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          // Trigger animation when element becomes visible
          if (containerRef.current) {
            animate(containerRef.current, {
              opacity: [0, 1],
              translateY: [30, 0],
              duration: duration,
              delay: delay,
              easing: 'easeOutQuad'
            });

            // Call optional callback
            if (onVisible) {
              onVisible();
            }
          }

          // Stop observing after animation
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (containerRef.current) {
      containerRef.current.style.opacity = '0';
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [hasAnimated, threshold, duration, delay, onVisible]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}
