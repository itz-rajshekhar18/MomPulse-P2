'use client';

import { motion } from 'framer-motion';

interface PreparationCardProps {
  doctorName: string;
  sessionStartsIn: string;
}

export default function PreparationCard({
  doctorName,
  sessionStartsIn,
}: PreparationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-3xl p-8 shadow-lg"
    >
      {/* Icon */}
      <div className="w-12 h-12 bg-pink-300 rounded-2xl flex items-center justify-center mb-6">
        <svg
          className="w-6 h-6 text-pink-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">
        Preparing for your session
      </h3>

      {/* Description */}
      <p className="text-gray-700 mb-6 leading-relaxed">
        Find a quiet space, grab a glass of water, and have any notes or
        questions ready for {doctorName}.
      </p>

      {/* Ready Soon Badge */}
      <div className="border-t border-pink-300 pt-4">
        <p className="text-xs text-pink-700 font-medium mb-1">READY SOON</p>
        <p className="text-sm text-gray-800 font-semibold">
          Session opens in {sessionStartsIn}
        </p>
      </div>
    </motion.div>
  );
}
