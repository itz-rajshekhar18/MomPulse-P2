'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface BabyGrowthInfoCardProps {
  week: number;
  comparison: string;
  description: string;
  imageUrl?: string;
}

export default function BabyGrowthInfoCard({
  week,
  comparison,
  description,
  imageUrl
}: BabyGrowthInfoCardProps) {
  const getComparisonEmoji = (comp: string) => {
    if (comp.toLowerCase().includes('eggplant')) return '🍆';
    if (comp.toLowerCase().includes('banana')) return '🍌';
    if (comp.toLowerCase().includes('avocado')) return '🥑';
    if (comp.toLowerCase().includes('cantaloupe')) return '🍈';
    return '🥚';
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Baby Growth Info */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
            <span className="text-lg">👶</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900">Baby's Growth</h3>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2 font-serif">
          Baby is the size of an {comparison}
        </h2>

        <p className="text-sm text-gray-600 leading-relaxed">
          {description}
        </p>
      </motion.div>

      {/* Visual Representation */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-6 shadow-sm border border-green-200 flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-transparent" />
        <div className="relative z-10 text-center">
          <div className="text-8xl mb-4">
            {getComparisonEmoji(comparison)}
          </div>
          <p className="text-sm font-medium text-gray-700">
            Week {week}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
