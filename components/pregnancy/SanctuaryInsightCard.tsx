'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface SanctuaryInsightCardProps {
  insight?: string;
  onStartSession?: () => void;
  isLoading?: boolean;
}

export default function SanctuaryInsightCard({ 
  insight, 
  onStartSession,
  isLoading = false
}: SanctuaryInsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 shadow-lg text-white"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className={`w-5 h-5 ${isLoading ? 'animate-pulse text-white/50' : ''}`} />
        <p className={`text-sm uppercase tracking-wide font-semibold ${isLoading ? 'text-white/50' : ''}`}>
          {isLoading ? 'Generating Insight...' : 'Sanctuary Insight'}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3 mb-6">
          <div className="h-6 w-full bg-white/20 rounded animate-pulse"></div>
          <div className="h-6 w-4/5 bg-white/20 rounded animate-pulse"></div>
          <div className="h-6 w-2/3 bg-white/20 rounded animate-pulse"></div>
        </div>
      ) : (
        <p className="text-xl font-medium leading-relaxed mb-6">
          "{insight}"
        </p>
      )}

      <button
        onClick={onStartSession}
        disabled={isLoading}
        className="w-full px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Start Session
      </button>
    </motion.div>
  );
}
