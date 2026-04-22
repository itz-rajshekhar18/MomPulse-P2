'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface CommunityPostProps {
  author: string;
  authorAvatar?: string;
  timeAgo: string;
  category: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  index?: number;
}

export default function CommunityPost({
  author,
  authorAvatar,
  timeAgo,
  category,
  content,
  image,
  likes: initialLikes,
  comments,
  index = 0,
}: CommunityPostProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
            {authorAvatar || author.charAt(0).toUpperCase()}
          </div>

          {/* Author Info */}
          <div>
            <h3 className="font-semibold text-gray-900">{author}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{timeAgo}</span>
              <span>•</span>
              <span className="text-purple-600 font-medium">{category}</span>
            </div>
          </div>
        </div>

        {/* More Options */}
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <p className="text-gray-700 mb-4 leading-relaxed">{content}</p>

      {/* Image */}
      {image && (
        <motion.div
          className="mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="aspect-video w-full" />
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-6">
          {/* Like Button */}
          <motion.button
            onClick={handleLike}
            className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'fill-none'}`}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="text-sm font-medium">{likes}</span>
          </motion.button>

          {/* Comment Button */}
          <motion.button
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="text-sm font-medium">{comments}</span>
          </motion.button>
        </div>

        {/* Bookmark Button */}
        <motion.button
          onClick={handleBookmark}
          className={`p-2 rounded-full transition-colors ${
            isBookmarked ? 'text-purple-600 bg-purple-50' : 'text-gray-400 hover:bg-gray-100'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg
            className={`w-5 h-5 ${isBookmarked ? 'fill-current' : 'fill-none'}`}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}
