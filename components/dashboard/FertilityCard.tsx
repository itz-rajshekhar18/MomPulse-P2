'use client';

import { motion } from 'framer-motion';

export default function FertilityCard() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
      {/* Decorative animated circles in background */}
      <motion.div
        className="absolute -top-10 -right-10 w-40 h-40 bg-purple-100 rounded-full opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-100 rounded-full opacity-20"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="grid lg:grid-cols-[300px_1fr_300px] gap-8 items-center relative z-10">
        {/* Left: Cycle Progress Circle */}
        <div className="flex items-center justify-center">
          <motion.div 
            className="relative w-56 h-56"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Background circle */}
            <svg className="w-56 h-56 transform -rotate-90">
              <motion.circle
                cx="112"
                cy="112"
                r="100"
                stroke="#E9D5FF"
                strokeWidth="16"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />
              {/* Progress circle */}
              <motion.circle
                cx="112"
                cy="112"
                r="100"
                stroke="#9333EA"
                strokeWidth="16"
                fill="none"
                strokeDasharray={`${(8 / 28) * 628} 628`}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.5, ease: 'easeInOut' }}
              />
            </svg>
            
            {/* Center text */}
            <motion.div 
              className="absolute inset-0 flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <div className="text-sm text-purple-500 font-medium mb-1">DAY 8</div>
              <div className="text-3xl font-bold text-gray-900 font-serif">Follicular</div>
              <div className="text-sm text-gray-500">Phase</div>
            </motion.div>
          </motion.div>
        </div>

        {/* Middle: Fertility Info */}
        <div className="text-center lg:text-left">
          <h3 className="text-3xl font-bold text-gray-900 mb-2 font-serif">
            Fertility Outlook
          </h3>
          <p className="text-gray-600 mb-8">
            High chance of conception starts soon
          </p>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <div className="text-xs text-purple-600 font-semibold uppercase tracking-wide mb-2">
                Window Opens
              </div>
              <div className="text-2xl font-bold text-gray-900">
                In 3 Days
              </div>
            </div>
            
            <div>
              <div className="text-xs text-purple-600 font-semibold uppercase tracking-wide mb-2">
                Next Period
              </div>
              <div className="text-2xl font-bold text-gray-900">
                Sept 28
              </div>
            </div>
          </div>

          <motion.button 
            className="w-full bg-purple-600 text-white py-4 px-6 rounded-2xl font-medium flex items-center justify-center gap-2"
            whileHover={{ 
              scale: 1.02,
              backgroundColor: '#7c3aed',
              boxShadow: '0 10px 30px rgba(147, 51, 234, 0.3)',
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            View Full Cycle Analysis
          </motion.button>
        </div>

        {/* Right: Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          <motion.a 
            href="/ai-assistant" 
            className="bg-purple-50 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 group aspect-square cursor-pointer"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 10px 30px rgba(147, 51, 234, 0.2)',
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="text-3xl"
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              ✨
            </motion.div>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
              Ask AI
            </span>
          </motion.a>

          <motion.button 
            className="bg-pink-50 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 group aspect-square"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 10px 30px rgba(236, 72, 153, 0.2)',
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="text-3xl"
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              📅
            </motion.div>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
              Book A Consultation
            </span>
          </motion.button>

          <motion.button 
            className="bg-teal-50 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 group aspect-square"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 10px 30px rgba(20, 184, 166, 0.2)',
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="text-3xl"
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              📚
            </motion.div>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
              Library
            </span>
          </motion.button>

          <motion.button 
            className="bg-purple-50 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 group aspect-square"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 10px 30px rgba(147, 51, 234, 0.2)',
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="text-3xl"
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              👥
            </motion.div>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
              Community
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
