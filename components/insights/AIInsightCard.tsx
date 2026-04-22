'use client';

import { motion } from 'framer-motion';

interface AIInsightCardProps {
  message: string;
  delay?: number;
}

export default function AIInsightCard({ message, delay = 0 }: AIInsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-8 shadow-lg text-white"
    >
      <div className="flex items-start gap-3 mb-4">
        <h3 className="text-xl font-bold font-serif flex items-center gap-2">
          AI Insights
          <span className="text-2xl">🧠</span>
        </h3>
      </div>
      <p className="text-purple-50 leading-relaxed">{message}</p>
    </motion.div>
  );
}
