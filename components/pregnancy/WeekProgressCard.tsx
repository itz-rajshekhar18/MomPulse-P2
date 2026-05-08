'use client';

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

interface WeekProgressCardProps {
  currentWeek: number;
  trimester: number;
  dueDate: string;
  nextMilestone?: string;
}

export default function WeekProgressCard({
  currentWeek,
  trimester,
  dueDate,
  nextMilestone = '3rd Trimester begins in 3 weeks'
}: WeekProgressCardProps) {
  const getTrimesterLabel = (tri: number) => {
    if (tri === 1) return 'Trimester 1';
    if (tri === 2) return 'Trimester 2';
    return 'Trimester 3';
  };

  return (
    <div className="space-y-4">
      {/* Current Progress */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 border border-purple-100"
      >
        <p className="text-sm text-purple-600 uppercase tracking-wide font-semibold mb-2">
          Current Progress
        </p>
        <h1 className="text-6xl font-bold text-purple-600 mb-2">
          Week {currentWeek}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="font-medium">{getTrimesterLabel(trimester)}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Due Date: {dueDate}</span>
          </div>
        </div>
      </motion.div>

      {/* Next Milestone */}
      {nextMilestone && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-green-50 rounded-2xl p-4 border border-green-200 flex items-start gap-3"
        >
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-green-600 uppercase tracking-wide font-semibold mb-1">
              Next Milestone
            </p>
            <p className="text-sm font-medium text-gray-900">
              {nextMilestone}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
