'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Leaf {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
  emoji: string;
}

export default function FloatingLeaves() {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    const leafEmojis = ['🍃', '🌿', '🌱', '🍀', '🌾'];
    const newLeaves: Leaf[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10,
      size: 20 + Math.random() * 20,
      rotation: Math.random() * 360,
      emoji: leafEmojis[Math.floor(Math.random() * leafEmojis.length)]
    }));
    setLeaves(newLeaves);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute"
          style={{
            left: `${leaf.x}%`,
            top: '-10%',
            fontSize: `${leaf.size}px`,
          }}
          initial={{ y: -100, rotate: 0, opacity: 0 }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, Math.sin(leaf.id) * 100, 0],
            rotate: [leaf.rotation, leaf.rotation + 360],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {leaf.emoji}
        </motion.div>
      ))}
    </div>
  );
}
