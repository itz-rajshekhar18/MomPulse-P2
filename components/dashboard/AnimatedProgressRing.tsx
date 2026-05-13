'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

interface AnimatedProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export default function AnimatedProgressRing({
  progress,
  size = 256,
  strokeWidth = 20,
  color = 'url(#gradient)'
}: AnimatedProgressRingProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Animate the circle drawing on mount
  useEffect(() => {
    if (circleRef.current) {
      // Reset to start state
      circleRef.current.style.strokeDashoffset = String(circumference);

      // Animate the stroke drawing
      animate(circleRef.current, {
        strokeDashoffset: [circumference, strokeDashoffset],
        duration: 1500,
        easing: 'easeInOutQuad'
      });
    }
  }, [progress, circumference, strokeDashoffset]);

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="transform -rotate-90"
    >
      {/* Background Circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
        fill="none"
      />

      {/* Animated Progress Circle */}
      <circle
        ref={circleRef}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={circumference}
        strokeLinecap="round"
      />

      {/* Gradient Definition */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}
