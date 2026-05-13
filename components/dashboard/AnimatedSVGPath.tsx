'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

interface AnimatedSVGPathProps {
  pathData: string;
  strokeColor?: string;
  strokeWidth?: number;
  duration?: number;
  delay?: number;
  viewBox?: string;
  className?: string;
}

export default function AnimatedSVGPath({
  pathData,
  strokeColor = '#a855f7',
  strokeWidth = 2,
  duration = 1000,
  delay = 0,
  viewBox = '0 0 100 100',
  className = ''
}: AnimatedSVGPathProps) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (pathRef.current) {
      const path = pathRef.current;
      const length = path.getTotalLength();

      // Set initial state
      path.style.strokeDasharray = String(length);
      path.style.strokeDashoffset = String(length);

      // Animate the path drawing
      animate(path, {
        strokeDashoffset: [length, 0],
        duration: duration,
        delay: delay,
        easing: 'easeInOutQuad'
      });
    }
  }, [duration, delay]);

  return (
    <svg
      viewBox={viewBox}
      className={`w-full h-full ${className}`}
      style={{ overflow: 'visible' }}
    >
      <path
        ref={pathRef}
        d={pathData}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
