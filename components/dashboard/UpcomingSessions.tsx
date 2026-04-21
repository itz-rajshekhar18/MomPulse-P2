'use client';

import { motion } from 'framer-motion';

export default function UpcomingSessions() {
  const sessions = [
    {
      title: 'Understanding Ovulation Myths',
      instructor: 'Live Workshop with Dr. Elena Rose',
      time: 'Tomorrow',
      timeDetail: '2:00 PM EST',
      avatar: '👩‍⚕️'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-sm">
      <motion.h3 
        className="text-xl font-bold text-gray-900 mb-4 font-serif"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Upcoming Sessions
      </motion.h3>

      <div className="space-y-4">
        {sessions.map((session, index) => (
          <motion.div 
            key={index} 
            className="bg-white rounded-xl p-4 flex items-center justify-between"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div className="flex items-center gap-4">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-2xl"
                whileHover={{ 
                  scale: 1.2,
                  rotate: [0, -10, 10, -10, 0]
                }}
                transition={{ duration: 0.5 }}
              >
                {session.avatar}
              </motion.div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  {session.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {session.instructor}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-medium text-gray-900 mb-1">
                {session.time}
              </div>
              <div className="text-xs text-gray-500 mb-2">
                {session.timeDetail}
              </div>
              <motion.button 
                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: '#7c3aed',
                  boxShadow: '0 5px 15px rgba(147, 51, 234, 0.3)',
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                Reserve Spot
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
