'use client';

import { motion } from 'framer-motion';

interface PowerFood {
  id: string;
  name: string;
  benefit: string;
  icon: string;
  color: string;
}

interface PowerFoodsCardProps {
  foods: PowerFood[];
}

export default function PowerFoodsCard({ foods }: PowerFoodsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6 font-serif">
        Power Foods for Pregnancy
      </h3>

      <div className="grid grid-cols-3 gap-4">
        {foods.map((food, index) => (
          <motion.div
            key={food.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            className="text-center"
          >
            <div className={`w-20 h-20 ${food.color} rounded-2xl flex items-center justify-center mx-auto mb-3 text-4xl`}>
              {food.icon}
            </div>
            <h4 className="font-bold text-gray-900 text-sm mb-1">{food.name}</h4>
            <p className="text-xs text-gray-600 leading-relaxed">{food.benefit}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
