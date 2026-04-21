'use client';

import { motion } from 'framer-motion';

export default function DailyInsight() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <motion.div 
          className="w-20 h-20 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl flex items-center justify-center flex-shrink-0"
          whileHover={{ 
            scale: 1.1,
            rotate: [0, -5, 5, -5, 0],
          }}
          transition={{ duration: 0.5 }}
        >
          <motion.svg 
            className="w-10 h-10 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </motion.svg>
        </motion.div>

        {/* Content */}
        <div className="flex-1">
          <motion.div 
            className="flex items-center gap-2 mb-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
              ✨ Daily Insight
            </span>
          </motion.div>
          
          <motion.h3 
            className="text-xl font-bold text-gray-900 mb-2 font-serif"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Listen to your energy today
          </motion.h3>
          
          <motion.p 
            className="text-gray-600 text-sm leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Your energy levels might be higher today due to rising estrogen. It's an excellent window for strength-based movement or starting new creative projects.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
