'use client';

import { motion } from 'framer-motion';
import { Droplet, Moon } from 'lucide-react';

interface DailyRitualsCardProps {
  waterIntake: number;
  waterGoal: number;
  sleepHours: number;
  sleepGoal: number;
  onUpdateWater?: () => void;
  onUpdateSleep?: () => void;
}

export default function DailyRitualsCard({
  waterIntake,
  waterGoal,
  sleepHours,
  sleepGoal,
  onUpdateWater,
  onUpdateSleep
}: DailyRitualsCardProps) {
  const waterPercentage = Math.min((waterIntake / waterGoal) * 100, 100);
  const sleepPercentage = Math.min((sleepHours / sleepGoal) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 className="text-lg font-bold text-gray-900">Daily Rituals</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Water Intake */}
        <button
          onClick={onUpdateWater}
          className="bg-purple-50 rounded-2xl p-4 hover:bg-purple-100 transition-colors text-left"
        >
          <div className="relative w-20 h-20 mx-auto mb-3">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="#E9D5FF"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="#9333EA"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 36}`}
                strokeDashoffset={`${2 * Math.PI * 36 * (1 - waterPercentage / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Droplet className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 text-center">
            {waterIntake}L
          </p>
          <p className="text-xs text-gray-500 text-center">{waterGoal}L goal</p>
        </button>

        {/* Sleep */}
        <button
          onClick={onUpdateSleep}
          className="bg-purple-50 rounded-2xl p-4 hover:bg-purple-100 transition-colors text-left"
        >
          <div className="relative w-20 h-20 mx-auto mb-3">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="#E9D5FF"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="#7C3AED"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 36}`}
                strokeDashoffset={`${2 * Math.PI * 36 * (1 - sleepPercentage / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Moon className="w-8 h-8 text-purple-700" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 text-center">
            {sleepHours}h
          </p>
          <p className="text-xs text-gray-500 text-center">{sleepGoal}h goal</p>
        </button>
      </div>
    </motion.div>
  );
}
