'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface Meal {
  id: string;
  type: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
  name: string;
  description: string;
  nutrients: string[];
  imageUrl?: string;
}

interface MealPlanCardProps {
  meals: Meal[];
  onCustomizePlan?: () => void;
}

export default function MealPlanCard({ meals, onCustomizePlan }: MealPlanCardProps) {
  const getNutrientColor = (nutrient: string) => {
    const colors: { [key: string]: string } = {
      'CALCIUM': 'bg-purple-100 text-purple-700',
      'FIBER': 'bg-pink-100 text-pink-700',
      'FOLATE': 'bg-green-100 text-green-700',
      'PROTEIN': 'bg-blue-100 text-blue-700',
      'IRON': 'bg-red-100 text-red-700',
    };
    return colors[nutrient] || 'bg-gray-100 text-gray-700';
  };

  const getMealEmoji = (type: string) => {
    switch (type) {
      case 'BREAKFAST': return '🥣';
      case 'LUNCH': return '🥗';
      case 'DINNER': return '🍽️';
      case 'SNACK': return '🍎';
      default: return '🍴';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 font-serif">Daily Meal Plan</h3>
        <button
          onClick={onCustomizePlan}
          className="text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1"
        >
          Customize Plan
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {meals.map((meal, index) => (
          <motion.div
            key={meal.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
            className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Meal Image */}
            <div className="relative h-40 bg-gradient-to-br from-purple-100 to-pink-100">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl">{getMealEmoji(meal.type)}</span>
              </div>
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 bg-white text-xs font-semibold text-gray-700 rounded-full">
                  {meal.type}
                </span>
              </div>
            </div>

            {/* Meal Info */}
            <div className="p-4">
              <h4 className="font-bold text-gray-900 mb-1">{meal.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{meal.description}</p>
              
              {/* Nutrients */}
              <div className="flex flex-wrap gap-2">
                {meal.nutrients.map((nutrient) => (
                  <span
                    key={nutrient}
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getNutrientColor(nutrient)}`}
                  >
                    {nutrient}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
