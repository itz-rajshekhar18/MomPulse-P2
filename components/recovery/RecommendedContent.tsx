'use client';

import Link from 'next/link';

export default function RecommendedContent() {
  const articles = [
    {
      category: 'WELLNESS GUIDE',
      title: 'Postpartum recovery tips: The first 6 weeks',
      description: 'Learn what to expect and how to nurture your body during the initial weeks of motherhood.',
      image: 'from-teal-400 to-cyan-500',
      icon: '💆‍♀️'
    },
    {
      category: 'STRENGTH & MOVEMENT',
      title: 'Regaining strength through gentle movements',
      description: 'A curated set of exercises designed for new mothers to rebuild core strength safely.',
      image: 'from-slate-600 to-slate-800',
      icon: '🏋️‍♀️'
    },
    {
      category: 'EMOTIONAL HEALTH',
      title: 'Mental health support: You are not alone',
      description: 'Navigating the complex emotions of the fourth trimester with grace and support.',
      image: 'from-cyan-400 to-blue-500',
      icon: '💙'
    }
  ];

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Recommended for You</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <Link
            key={index}
            href="/sanctuary"
            className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            {/* Image Placeholder */}
            <div className={`h-48 bg-gradient-to-br ${article.image} relative overflow-hidden flex items-center justify-center`}>
              <span className="text-6xl">{article.icon}</span>
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800 uppercase tracking-wide">
                  {article.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                {article.title}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {article.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
