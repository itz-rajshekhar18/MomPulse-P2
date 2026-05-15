'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface NutritionInsightCardProps {
  insight?: string;
  emoji?: string;
  isLoading?: boolean;
}

export default function NutritionInsightCard({ 
  insight, 
  emoji = '🍋',
  isLoading = false
}: NutritionInsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl p-6 shadow-sm border border-purple-200"
    >
      <div className="flex items-start gap-4">
        {isLoading ? (
          <>
            <div className="w-12 h-12 bg-purple-300/50 rounded-2xl flex-shrink-0 animate-pulse"></div>
            <div className="flex-1 space-y-3 pt-1">
              <p className="text-xs text-purple-700/50 uppercase tracking-wide font-semibold mb-2">
                Generating Insight...
              </p>
              <div className="space-y-2">
                <div className="h-4 w-full bg-purple-200 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-purple-200 rounded animate-pulse"></div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-purple-700 uppercase tracking-wide font-semibold mb-2">
                Sanctuary Insight
              </p>
              <p className="text-sm text-gray-800 leading-relaxed">
                "{insight}" {emoji}
              </p>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
