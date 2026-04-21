'use client';

import { motion } from 'framer-motion';

export default function PreconceptionLibrary() {
  const articles = [
    {
      category: 'NUTRITION',
      title: 'Fueling for Fertility: Essential Superfoods',
      image: '/083539af180352d45c1d82f9206b540671268f60.jpg',
      color: 'bg-green-100'
    },
    {
      category: 'SUPPLEMENTS',
      title: 'Prenatal Vitamins: Which ones actually matter?',
      image: '/090236fed93233aaeb6a6c437a3c38723e8f7c2f.jpg',
      color: 'bg-orange-100'
    },
    {
      category: 'MINDSET',
      title: 'Managing Stress During the TTC Journey',
      image: '/ea4cabba381e43e5ba06d28d171a36664a9f8641.jpg',
      color: 'bg-purple-100'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <motion.h3 
          className="text-xl font-bold text-gray-900 font-serif"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Preconception Library
        </motion.h3>
        <motion.button 
          className="text-purple-600 text-sm font-medium hover:text-purple-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Explore All
        </motion.button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <motion.div 
            key={index} 
            className="group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -5 }}
          >
            <motion.div 
              className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-gray-100"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`absolute inset-0 ${article.color} opacity-20`}></div>
              <motion.div 
                className="absolute inset-0 flex items-center justify-center text-6xl"
                whileHover={{ 
                  scale: 1.2,
                  rotate: [0, -10, 10, -10, 0]
                }}
                transition={{ duration: 0.5 }}
              >
                {index === 0 ? '🥗' : index === 1 ? '💊' : '🧘‍♀️'}
              </motion.div>
            </motion.div>
            
            <div className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">
              {article.category}
            </div>
            <h4 className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
              {article.title}
            </h4>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
