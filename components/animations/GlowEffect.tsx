'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlowEffectProps {
  children: ReactNode;
  color?: string;
  className?: string;
}

export default function GlowEffect({ children, color = 'purple', className = '' }: GlowEffectProps) {
  const glowColors = {
    purple: 'shadow-purple-500/50',
    pink: 'shadow-pink-500/50',
    teal: 'shadow-teal-500/50',
    green: 'shadow-green-500/50',
  };

  return (
    <motion.div
      whileHover={{
        boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)',
      }}
      transition={{ duration: 0.3 }}
      className={`${className} ${glowColors[color as keyof typeof glowColors]}`}
    >
      {children}
    </motion.div>
  );
}
