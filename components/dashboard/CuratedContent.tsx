'use client';

import { useState, useEffect } from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getArticlesBySection, Article, ContentSection } from '@/lib/firestore';
import { useAuth } from '@/contexts/AuthContext';

interface CuratedContentProps {
  section?: ContentSection;
}

export default function CuratedContent({ section = 'general' }: CuratedContentProps) {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Fetch articles for the specified section
        const articlesData = await getArticlesBySection(section, 3);
        setArticles(articlesData);
      } catch (error) {
        console.error('Error fetching curated content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [user, section]);

  // Helper function to get gradient based on category
  const getCategoryGradient = (category: string) => {
    const gradients: Record<string, string> = {
      'nutrition': 'from-green-400 to-emerald-500',
      'mental-health': 'from-slate-600 to-slate-800',
      'mindfulness': 'from-indigo-500 to-purple-600',
      'movement': 'from-teal-500 to-cyan-600',
      'sleep': 'from-blue-500 to-indigo-600',
      'recovery': 'from-orange-400 to-red-500',
      'health': 'from-pink-400 to-rose-500',
    };
    return gradients[category] || 'from-gray-400 to-gray-600';
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Curated for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-5">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
        {articles.length > 0 ? (
          articles.map((article) => (
            <Link
              key={article.id}
              href="/sanctuary"
              className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              {/* Image Placeholder */}
              <div className={`h-48 bg-gradient-to-br ${getCategoryGradient(article.category)} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800 uppercase">
                    {article.category.replace('-', ' ')}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{article.readTime || 5} min read</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-3 text-center py-8 text-gray-500">
            No curated content available yet. Check back soon!
          </div>
        )}
      </div>
    </div>
  );
}
