'use client';

import { motion } from 'framer-motion';

interface TopicPillProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export default function TopicPill({ label, isActive = false, onClick }: TopicPillProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
        isActive
          ? 'bg-purple-600 text-white shadow-md'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {label}
    </motion.button>
  );
}
