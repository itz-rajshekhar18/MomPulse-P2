'use client';

import { motion } from 'framer-motion';

interface WeeklyTipProps {
  tip: string;
}

export default function WeeklyTip({ tip }: WeeklyTipProps) {
  return (
    <motion.div
      className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-6 border border-teal-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start gap-3">
        <motion.div
          className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </motion.div>

        <div>
          <h4 className="font-bold text-teal-900 mb-2">Weekly Wellness Tip</h4>
          <p className="text-sm text-teal-800 italic leading-relaxed">"{tip}"</p>
        </div>
      </div>
    </motion.div>
  );
}
