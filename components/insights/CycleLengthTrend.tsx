'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface CycleData {
  id: string;
  start_date: string;
  end_date: string;
  [key: string]: any;
}

interface CycleLengthTrendProps {
  cycles: CycleData[];
}

export default function CycleLengthTrend({ cycles }: CycleLengthTrendProps) {
  // Calculate cycle lengths and organize by month
  const cyclesByMonth = useMemo(() => {
    if (!cycles || cycles.length === 0) {
      return [];
    }

    // Calculate cycle lengths
    const cyclesWithLength = cycles.map((cycle, index) => {
      const startDate = new Date(cycle.start_date);
      const endDate = new Date(cycle.end_date);
      const lengthDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      return {
        ...cycle,
        lengthDays,
        startDate,
        endDate,
        month: startDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
        displayDate: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase(),
      };
    });

    // Group by month (last 6 cycles)
    const last6Cycles = cyclesWithLength.slice(-6);
    
    return last6Cycles.map((cycle, index) => ({
      month: cycle.month,
      date: cycle.displayDate,
      day: cycle.lengthDays,
      isCurrent: index === last6Cycles.length - 1,
    }));
  }, [cycles]);

  // Show placeholder if no data
  if (cyclesByMonth.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-gray-900 font-serif">Cycle Length Trend</h3>
          <span className="text-sm text-gray-500">NO DATA YET</span>
        </div>
        <div className="text-center py-12 text-gray-400">
          <p>Log more cycles to see your trend</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-gray-900 font-serif">Cycle Length Trend</h3>
        <span className="text-sm text-gray-500">LAST {cyclesByMonth.length} CYCLES</span>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {cyclesByMonth.map((cycleData, index) => (
          <div key={index} className="flex items-center gap-4">
            {/* Month Label */}
            <div className="w-16 text-sm text-gray-500 font-medium">{cycleData.month}</div>

            {/* Date and Day */}
            <div className="flex-1 flex items-center gap-2">
              <div className="flex flex-col items-center">
                <div className="text-xs text-gray-400 mb-1">{cycleData.date}</div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-semibold ${
                    cycleData.isCurrent
                      ? 'bg-purple-600 text-white ring-4 ring-purple-200'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {cycleData.day}
                </div>
                <div className="mt-2 w-full h-1 bg-purple-600 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* History Button */}
      <button className="mt-6 flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-sm font-medium">HISTORY</span>
      </button>
    </motion.div>
  );
}
