'use client';

import { motion } from 'framer-motion';

interface NutrientProgress {
  name: string;
  current: number;
  goal: number;
  unit: string;
  color: string;
}

interface DailyProgressCardProps {
  nutrients: NutrientProgress[];
  onLogEntry?: () => void;
}

export default function DailyProgressCard({ nutrients, onLogEntry }: DailyProgressCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-green-50 rounded-3xl p-6 shadow-sm border border-green-100"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-6">Daily Progress</h3>

      <div className="space-y-4">
        {nutrients.map((nutrient, index) => {
          const percentage = Math.min((nutrient.current / nutrient.goal) * 100, 100);
          
          return (
            <motion.div
              key={nutrient.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{nutrient.name}</span>
                <span className="text-sm font-bold text-gray-900">
                  {nutrient.current} / {nutrient.goal}{nutrient.unit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                  className={`h-3 rounded-full ${nutrient.color}`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={onLogEntry}
        className="w-full mt-6 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-purple-400 transition-all"
      >
        Log Entry
      </button>
    </motion.div>
  );
}
