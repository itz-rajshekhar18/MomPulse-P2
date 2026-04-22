'use client';

import { motion } from 'framer-motion';

interface FertilityWindowTimelineProps {
  prediction?: {
    next_period_date: string;
    ovulation_date: string;
    fertile_window_start: string;
    fertile_window_end: string;
    avg_cycle_length: number;
    cycle_regularity: string;
  } | null;
}

export default function FertilityWindowTimeline({ prediction }: FertilityWindowTimelineProps) {
  // Calculate timeline positions based on prediction
  const getTimelineData = () => {
    if (!prediction) {
      return {
        fertileStart: 35,
        fertileWidth: 30,
        currentDay: 14,
        totalDays: 28,
      };
    }

    const cycleLength = Math.round(prediction.avg_cycle_length);
    const ovulationDay = Math.ceil((new Date(prediction.ovulation_date).getTime() - new Date(prediction.next_period_date).getTime()) / (1000 * 60 * 60 * 24)) + cycleLength;
    const fertileStartDay = Math.ceil((new Date(prediction.fertile_window_start).getTime() - new Date(prediction.next_period_date).getTime()) / (1000 * 60 * 60 * 24)) + cycleLength;
    const fertileEndDay = Math.ceil((new Date(prediction.fertile_window_end).getTime() - new Date(prediction.next_period_date).getTime()) / (1000 * 60 * 60 * 24)) + cycleLength;

    return {
      fertileStart: (fertileStartDay / cycleLength) * 100,
      fertileWidth: ((fertileEndDay - fertileStartDay) / cycleLength) * 100,
      currentDay: ovulationDay,
      totalDays: cycleLength,
    };
  };

  const timeline = getTimelineData();
  const regularity = prediction?.cycle_regularity || 'regular';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-8 font-serif">Fertility Window Timeline</h3>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Bar */}
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          {/* Fertile Window Highlight */}
          <div
            className="absolute h-full bg-gradient-to-r from-green-300 to-green-400 rounded-full"
            style={{ left: `${timeline.fertileStart}%`, width: `${timeline.fertileWidth}%` }}
          ></div>
        </div>

        {/* Marker */}
        <div className="absolute top-1/2 -translate-y-1/2" style={{ left: '50%' }}>
          <div className="relative">
            <div className="w-8 h-8 bg-white border-4 border-green-500 rounded-full shadow-lg"></div>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <div className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-bold">
                FERTILE WINDOW
              </div>
            </div>
          </div>
        </div>

        {/* Day Labels */}
        <div className="flex justify-between mt-4 text-xs text-gray-500">
          <span>DAY 1</span>
          <span>DAY {Math.floor(timeline.totalDays / 4)}</span>
          <span className="font-bold text-green-600">FERTILE WINDOW</span>
          <span>DAY {Math.floor(timeline.totalDays * 3 / 4)}</span>
          <span>DAY {timeline.totalDays}</span>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-4 mt-8">
        <div className="flex items-start gap-3 p-4 bg-pink-50 rounded-2xl">
          <div className="w-10 h-10 bg-pink-200 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-pink-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-1">Pattern Identified</h4>
            <p className="text-sm text-gray-600">
              {prediction 
                ? `Ovulation occurs around Day ${Math.floor(timeline.totalDays / 2)} of your ${timeline.totalDays}-day cycle.`
                : 'Ovulation occurs consistently around Day 14 of your cycle.'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-teal-50 rounded-2xl">
          <div className="w-10 h-10 bg-teal-200 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-1">Cycle Regularity</h4>
            <p className="text-sm text-gray-600">
              {regularity === 'very regular' && 'Your cycle is very consistent with minimal variation.'}
              {regularity === 'mostly regular' && 'Your cycle is mostly regular with slight variations.'}
              {regularity === 'somewhat irregular' && 'Cycle length varies by a few days each month.'}
              {regularity === 'irregular' && 'Cycle length shows significant variation. Consider tracking more factors.'}
              {!regularity.includes('regular') && 'Cycle length varies by 1-2 days based on stress indicators.'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
