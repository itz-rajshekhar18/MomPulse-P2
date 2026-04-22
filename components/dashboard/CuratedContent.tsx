'use client';

import { Clock, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CuratedContent() {
  const articles = [
    {
      category: 'NUTRITION',
      title: 'Nourishing Your Body Post-Birth',
      readTime: '9 min read',
      image: '/images/nutrition.jpg',
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      category: 'MINDFULNESS',
      title: 'Managing New Parent Anxiety',
      readTime: '5 min read',
      image: '/images/mindfulness.jpg',
      gradient: 'from-slate-600 to-slate-800'
    },
    {
      category: 'MOVEMENT',
      title: 'Pelvic Floor First Steps',
      readTime: '5 min read',
      image: '/images/movement.jpg',
      gradient: 'from-teal-500 to-cyan-600'
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Curated for You</h2>
        <Link href="/sanctuary" className="text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-1">
          <span>View All</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <Link
            key={index}
            href="/sanctuary"
            className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            {/* Image Placeholder */}
            <div className={`h-48 bg-gradient-to-br ${article.gradient} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800">
                  {article.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                {article.title}
              </h3>
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                <span>{article.readTime}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
