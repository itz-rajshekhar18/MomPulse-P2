'use client';

import { motion } from 'framer-motion';

export default function HealthOverview() {
  const metrics = [
    {
      label: 'My Health',
      value: '85%',
      icon: '❤️',
      color: 'text-red-500'
    },
    {
      label: 'Sleep Score',
      value: '7.5h',
      icon: '😴',
      color: 'text-blue-500'
    },
    {
      label: 'Stress',
      value: 'Low',
      icon: '🧘',
      color: 'text-green-500'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <motion.h3 
        className="text-lg font-bold text-gray-900 mb-4 font-serif"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Health Overview
      </motion.h3>
      
      <div className="grid grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <motion.div 
            key={index} 
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: index * 0.1,
              duration: 0.4,
            }}
            whileHover={{ 
              scale: 1.1,
              transition: { duration: 0.2 }
            }}
          >
            <motion.div 
              className="text-3xl mb-2"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                delay: index * 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {metric.icon}
            </motion.div>
            <div className="text-xs text-gray-500 mb-1">{metric.label}</div>
            <motion.div 
              className={`text-lg font-bold ${metric.color}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              {metric.value}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
