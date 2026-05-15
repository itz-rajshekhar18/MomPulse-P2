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
  const getFruitImage = (comp: string) => {
    const images: Record<string, string> = {
      'Poppy Seed': '/images/seeds/poppy_seed_1778887003729.png',
      'Raspberry': '/images/seeds/raspberry_1778887030580.png',
      'Lime': '/images/seeds/lime_1778887097763.png',
      'Avocado': '/images/seeds/avocado_1778887336490.png',
      'Banana': '/images/seeds/banana_1778887373499.png',
    };
    return images[comp] || null;
  };

  const getFruitEmoji = (comp: string) => {
    const emojis: Record<string, string> = {
      'Poppy Seed': '🌑',
      'Raspberry': '🍓',
      'Lime': '🍋',
      'Avocado': '🥑',
      'Banana': '🍌',
      'Cantaloupe': '🍈',
      'Eggplant': '🍆',
      'Pineapple': '🍍',
      'Honeydew': '🍈',
      'Watermelon': '🍉',
    };
    return emojis[comp] || '🥚';
  };

  const fruitImage = getFruitImage(comparison);

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
        <div className="relative z-10 text-center flex flex-col items-center">
          <div className="w-32 h-32 mb-4 bg-white/50 rounded-full flex items-center justify-center overflow-hidden shadow-inner border-2 border-white">
            {fruitImage ? (
              <Image 
                src={fruitImage} 
                alt={comparison} 
                width={128} 
                height={128} 
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-6xl">{getFruitEmoji(comparison)}</span>
            )}
          </div>
          <p className="text-sm font-medium text-gray-700">
            Week {week}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
