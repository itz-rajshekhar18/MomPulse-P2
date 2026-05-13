'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

interface PathConfig {
  d: string;
  strokeColor?: string;
  strokeWidth?: number;
}

interface StaggeredSVGPathsProps {
  paths: PathConfig[];
  staggerDelay?: number;
  duration?: number;
  viewBox?: string;
  className?: string;
}

export default function StaggeredSVGPaths({
  paths,
  staggerDelay = 100,
  duration = 800,
  viewBox = '0 0 100 100',
  className = ''
}: StaggeredSVGPathsProps) {
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    pathRefs.current.forEach((pathElement, index) => {
      if (pathElement) {
        const length = pathElement.getTotalLength();

        // Set initial state
        pathElement.style.strokeDasharray = String(length);
        pathElement.style.strokeDashoffset = String(length);

        // Animate each path with stagger
        animate(pathElement, {
          strokeDashoffset: [length, 0],
          duration: duration,
          delay: index * staggerDelay,
          easing: 'easeInOutQuad'
        });
      }
    });
  }, [staggerDelay, duration]);

  return (
    <svg
      viewBox={viewBox}
      className={`w-full h-full ${className}`}
      style={{ overflow: 'visible' }}
    >
      {paths.map((path, index) => (
        <path
          key={index}
          ref={(el) => {
            pathRefs.current[index] = el;
          }}
          d={path.d}
          stroke={path.strokeColor || '#a855f7'}
          strokeWidth={path.strokeWidth || 2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
