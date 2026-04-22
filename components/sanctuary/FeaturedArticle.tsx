'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface FeaturedArticleProps {
  badge: string;
  readTime: string;
  title: string;
  description: string;
  image: string;
  category: string;
}

export default function FeaturedArticle({
  badge,
  readTime,
  title,
  description,
  image,
  category,
}: FeaturedArticleProps) {
  return (
    <motion.div
      className="relative bg-gradient-to-br from-teal-900 to-teal-700 rounded-3xl overflow-hidden h-[400px] cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-gradient-to-r from-teal-600 to-purple-600" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-between">
        <div>
          <div className="flex gap-3 mb-4">
            <span className="px-4 py-1.5 bg-purple-600 text-white text-xs font-semibold rounded-full uppercase tracking-wide">
              {badge}
            </span>
            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
              {readTime}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif leading-tight">
            {title}
          </h2>

          <p className="text-white/90 text-lg mb-6 max-w-2xl">
            {description}
          </p>
        </div>

        <motion.button
          className="flex items-center gap-2 bg-white text-teal-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors w-fit"
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          Read Story
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}
