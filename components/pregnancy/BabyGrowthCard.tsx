'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface BabyGrowthCardProps {
  week: number;
  trimester: number;
  comparison: string;
  weight: string;
  progress: number;
}

export default function BabyGrowthCard({ 
  week, 
  trimester, 
  comparison, 
  weight, 
  progress 
}: BabyGrowthCardProps) {
  const getTrimesterLabel = (tri: number) => {
    if (tri === 1) return 'First Trimester';
    if (tri === 2) return 'Second Trimester';
    return 'Third Trimester';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 shadow-sm border border-purple-100"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-4 py-1.5 bg-purple-600 text-white text-sm font-semibold rounded-full">
              Week {week}
            </span>
            <span className="px-4 py-1.5 bg-pink-100 text-pink-700 text-sm font-semibold rounded-full">
              {getTrimesterLabel(trimester)}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2 font-serif">
            Baby is the size of a
          </h2>
          <p className="text-4xl font-bold text-purple-600 italic font-serif">
            {comparison}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Progress</span>
              <span className="text-2xl font-bold text-purple-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-1">
              Current Weight
            </p>
            <p className="text-3xl font-bold text-gray-900">~{weight}</p>
          </div>

          <button className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
            Detailed Tracker
          </button>
        </div>

        <div className="relative h-64 md:h-80">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-3xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full shadow-lg flex items-center justify-center">
              <span className="text-6xl">🥚</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
