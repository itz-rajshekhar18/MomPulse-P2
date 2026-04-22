'use client';

import { motion } from 'framer-motion';

interface VideoCardProps {
  title: string;
  duration: string;
  views: string;
  thumbnail?: string;
  category: string;
}

export default function VideoCard({
  title,
  duration,
  views,
  thumbnail,
  category,
}: VideoCardProps) {
  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.3 }}
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-teal-200 to-purple-200 overflow-hidden">
        {/* Play Button Overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors"
          whileHover={{ scale: 1.1 }}
        >
          <motion.div
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6 text-purple-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Duration Badge */}
        <div className="absolute bottom-3 right-3">
          <span className="px-2 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold rounded">
            {duration}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700 rounded-full uppercase tracking-wide">
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {views}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
