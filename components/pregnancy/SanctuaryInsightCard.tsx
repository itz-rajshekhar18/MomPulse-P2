'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface SanctuaryInsightCardProps {
  insight: string;
  onStartSession?: () => void;
}

export default function SanctuaryInsightCard({ 
  insight, 
  onStartSession 
}: SanctuaryInsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 shadow-lg text-white"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5" />
        <p className="text-sm uppercase tracking-wide font-semibold">
          Sanctuary Insight
        </p>
      </div>

      <p className="text-xl font-medium leading-relaxed mb-6">
        "{insight}"
      </p>

      <button
        onClick={onStartSession}
        className="w-full px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all"
      >
        Start Session
      </button>
    </motion.div>
  );
}
