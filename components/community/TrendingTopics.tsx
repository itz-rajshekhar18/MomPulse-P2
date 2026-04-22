'use client';

import { motion } from 'framer-motion';

interface TrendingTopic {
  rank: number;
  title: string;
  posts: string;
}

interface TrendingTopicsProps {
  topics: TrendingTopic[];
}

export default function TrendingTopics({ topics }: TrendingTopicsProps) {
  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4 font-serif">
        Trending Topics
      </h3>

      <div className="space-y-4">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.rank}
            className="flex items-start gap-3 cursor-pointer group"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 5 }}
          >
            {/* Rank */}
            <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-lg font-bold text-sm flex-shrink-0">
              #{topic.rank}
            </div>

            {/* Content */}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors mb-1">
                {topic.title}
              </h4>
              <p className="text-xs text-gray-500">{topic.posts}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
