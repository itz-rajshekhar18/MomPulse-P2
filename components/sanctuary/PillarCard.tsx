'use client';

import { motion } from 'framer-motion';

interface PillarCardProps {
  icon: string;
  title: string;
  color: string;
}

export default function PillarCard({ icon, title, color }: PillarCardProps) {
  const colorClasses: Record<string, string> = {
    pink: 'bg-pink-100 hover:bg-pink-200',
    green: 'bg-green-100 hover:bg-green-200',
    purple: 'bg-purple-100 hover:bg-purple-200',
    teal: 'bg-teal-100 hover:bg-teal-200',
  };

  return (
    <motion.button
      className={`${colorClasses[color]} rounded-2xl p-6 flex flex-col items-center justify-center gap-3 aspect-square transition-all cursor-pointer`}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="text-4xl"
        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
      <span className="text-sm font-semibold text-gray-800 text-center">
        {title}
      </span>
    </motion.button>
  );
}
