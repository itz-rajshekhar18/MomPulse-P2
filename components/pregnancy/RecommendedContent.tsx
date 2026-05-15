'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { useEffect, useState } from 'react';
import { getArticlesBySection, getVideosBySection } from '@/lib/firestore';

interface ContentCard {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  link: string;
}

interface RecommendedContentProps {
  currentWeek?: number;
}

export default function RecommendedContent({ currentWeek = 24 }: RecommendedContentProps) {
  const [recommendations, setRecommendations] = useState<ContentCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const [articles, videos] = await Promise.all([
          getArticlesBySection('pregnancy', 1),
          getVideosBySection('pregnancy', 1)
        ]);
        
        const cards: ContentCard[] = [];
        
        if (articles.length > 0) {
          cards.push({
            id: articles[0].id,
            title: articles[0].title,
            description: articles[0].excerpt || articles[0].content.substring(0, 100) + '...',
            category: 'ARTICLE',
            image: articles[0].imageUrl || '/images/nutrition-guide.jpg',
            link: `/sanctuary/articles/${articles[0].id}`
          });
        }
        
        if (videos.length > 0) {
          cards.push({
            id: videos[0].id,
            title: videos[0].title,
            description: videos[0].description || 'Watch our latest video guide.',
            category: 'VIDEO',
            image: videos[0].thumbnailUrl || '/images/pregnancy-exercise.jpg',
            link: `/sanctuary/videos/${videos[0].id}`
          });
        }

        // If firestore is empty, fallback to some defaults so the UI doesn't look empty
        if (cards.length === 0) {
          cards.push(
            {
              id: 'default-1',
              title: 'Nutrition Guide for Week ' + currentWeek,
              description: 'Essential nutrients for you and your baby.',
              category: 'ARTICLE',
              image: '/images/nutrition-guide.jpg',
              link: '/sanctuary'
            },
            {
              id: 'default-2',
              title: 'Safe Movement',
              description: 'Low-impact exercises for your trimester.',
              category: 'VIDEO',
              image: '/images/pregnancy-exercise.jpg',
              link: '/sanctuary'
            }
          );
        }
        
        setRecommendations(cards);
      } catch (error) {
        console.error('Failed to load recommendations', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentWeek]);

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
        {isLoading ? (
          <>
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-2xl bg-gray-200 h-48 w-full"></div>
            </div>
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-2xl bg-gray-200 h-48 w-full"></div>
            </div>
          </>
        ) : (
          recommendations.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="group cursor-pointer"
            >
              <Link href={item.link}>
                <div className="relative h-48 rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-purple-100 to-pink-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl">
                      {item.category === 'ARTICLE' ? '📖' : '🎥'}
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
          ))
        )}
      </div>
    </motion.div>
  );
}
