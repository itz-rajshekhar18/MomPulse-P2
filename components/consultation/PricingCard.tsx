'use client';

import { motion } from 'framer-motion';

interface PricingCardProps {
  title: string;
  price: string;
  period?: string;
  features: string[];
  buttonText: string;
  isPremium?: boolean;
  delay?: number;
}

export default function PricingCard({
  title,
  price,
  period,
  features,
  buttonText,
  isPremium = false,
  delay = 0,
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`relative rounded-3xl p-8 ${
        isPremium
          ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200'
          : 'bg-white border-2 border-gray-200'
      } hover:shadow-xl transition-all duration-300`}
    >
      {isPremium && (
        <div className="absolute -top-4 right-8">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Popular
          </div>
        </div>
      )}

      <h3 className="text-2xl font-bold text-gray-900 mb-2 font-serif">{title}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold text-gray-900">{price}</span>
        {period && <span className="text-gray-600 ml-2">{period}</span>}
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <svg
              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                isPremium ? 'text-purple-600' : 'text-gray-400'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        className={`w-full py-4 rounded-full font-medium transition-all duration-300 ${
          isPremium
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-105'
            : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-purple-300'
        }`}
      >
        {buttonText}
      </button>
    </motion.div>
  );
}
