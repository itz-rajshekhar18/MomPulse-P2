'use client';

import { motion } from 'framer-motion';

interface ArticleCardProps {
  category: string;
  title: string;
  description?: string;
  readTime: string;
  likes: string;
  image?: string;
  icon?: string;
  bgColor?: string;
  author?: string;
  authorAvatar?: string;
}

export default function ArticleCard({
  category,
  title,
  description,
  readTime,
  likes,
  image,
  icon,
  bgColor = 'bg-gray-100',
  author,
  authorAvatar,
}: ArticleCardProps) {
  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.3 }}
    >
      {/* Image or Icon */}
      <div className={`relative h-48 ${bgColor} flex items-center justify-center overflow-hidden`}>
        {image ? (
          <div className="w-full h-full bg-gradient-to-br from-purple-200 to-pink-200" />
        ) : (
          <motion.div
            className="text-6xl"
            whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            {icon}
          </motion.div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700 rounded-full uppercase tracking-wide">
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {author && (
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {authorAvatar || '👩‍⚕️'}
            </div>
            <span className="text-sm text-gray-600">By {author}</span>
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {readTime}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {likes}
            </span>
          </div>
          
          <motion.div
            className="text-purple-600 font-semibold"
            whileHover={{ x: 5 }}
          >
            Read →
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
