'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface AIInsightCardProps {
  title: string;
  message: string;
  icon?: string;
}

export default function AIInsightCard({ 
  title, 
  message, 
  icon = '👂' 
}: AIInsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gradient-to-br from-green-50 to-teal-50 rounded-3xl p-6 shadow-sm border border-green-100"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-green-600" />
            <p className="text-xs text-green-600 uppercase tracking-wide font-semibold">
              Today's AI Insight
            </p>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 font-serif">
            {title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
