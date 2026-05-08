'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ContentCard {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  link: string;
}

interface RecommendedContentProps {
  content?: ContentCard[];
}

export default function RecommendedContent({ content }: RecommendedContentProps) {
  const defaultContent: ContentCard[] = [
    {
      id: '1',
      title: 'The Ultimate Guide to Second Trimester Nutrition',
      description: 'Key vitamins and minerals your body needs during weeks 13 to 26.',
      category: 'NUTRITION',
      image: '/images/nutrition-guide.jpg',
      link: '/sanctuary'
    },
    {
      id: '2',
      title: 'Safe Exercises this Week',
      description: 'Low-impact routines to stay active and reduce pelvic pressure.',
      category: 'FITNESS',
      image: '/images/pregnancy-exercise.jpg',
      link: '/sanctuary'
    }
  ];

  const displayContent = content || defaultContent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 font-serif">
          Recommended for You
        </h3>
        <Link 
          href="/sanctuary"
          className="text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1"
        >
          View all library
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {displayContent.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            className="group cursor-pointer"
          >
            <Link href={item.link}>
              <div className="relative h-48 rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-purple-100 to-pink-100">
                {/* Placeholder for image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl">
                    {item.category === 'NUTRITION' ? '🥗' : '🧘‍♀️'}
                  </span>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white text-xs font-semibold text-gray-700 rounded-full">
                    {item.category}
                  </span>
                </div>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors font-serif">
                {item.title}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
