'use client';

import { motion } from 'framer-motion';

interface SessionCardProps {
  title: string;
  date: string;
  time: string;
  attendees: number;
  color: 'pink' | 'green' | 'purple';
  delay?: number;
}

export default function SessionCard({
  title,
  date,
  time,
  attendees,
  color,
  delay = 0,
}: SessionCardProps) {
  const colorClasses = {
    pink: 'bg-pink-100 text-pink-700',
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
  };

  const iconBgClasses = {
    pink: 'bg-pink-200',
    green: 'bg-green-200',
    purple: 'bg-purple-200',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-16 h-16 ${iconBgClasses[color]} rounded-2xl flex items-center justify-center flex-shrink-0`}>
          <div className={`text-2xl font-bold ${colorClasses[color].split(' ')[1]}`}>
            {date.split(' ')[0]}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{time}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{attendees} attending</span>
          </div>
        </div>

        {/* Button */}
        <button className="px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors flex-shrink-0">
          Reserve Slot
        </button>
      </div>
    </motion.div>
  );
}
