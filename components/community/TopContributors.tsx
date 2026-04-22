'use client';

import { motion } from 'framer-motion';

interface Contributor {
  name: string;
  role: string;
  avatar?: string;
}

interface TopContributorsProps {
  contributors: Contributor[];
}

export default function TopContributors({ contributors }: TopContributorsProps) {
  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4 font-serif">
        Top Contributors
      </h3>

      <div className="space-y-4">
        {contributors.map((contributor, index) => (
          <motion.div
            key={index}
            className="flex items-center justify-between cursor-pointer group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 5 }}
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                {contributor.avatar || contributor.name.charAt(0)}
              </div>

              {/* Info */}
              <div>
                <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                  {contributor.name}
                </h4>
                <p className="text-xs text-gray-500">{contributor.role}</p>
              </div>
            </div>

            {/* Follow Button */}
            <motion.button
              className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
