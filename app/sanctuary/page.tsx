'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  getUserProfile, 
  getOnboardingData, 
  getArticlesBySection, 
  getVideosBySection,
  Article,
  Video,
  ContentSection
} from '@/lib/firestore';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PeriodTrackerHeader from '@/components/dashboard/PeriodTrackerHeader';
import FeaturedArticle from '@/components/sanctuary/FeaturedArticle';
import CategoryPills from '@/components/sanctuary/CategoryPills';
import PillarCard from '@/components/sanctuary/PillarCard';
import ArticleCard from '@/components/sanctuary/ArticleCard';
import VideoCard from '@/components/sanctuary/VideoCard';
import NewsletterBanner from '@/components/sanctuary/NewsletterBanner';
import FloatingLeaves from '@/components/animations/FloatingLeaves';
import { motion } from 'framer-motion';

export default function SanctuaryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All Stories');
  const [isPeriodTracker, setIsPeriodTracker] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [userSection, setUserSection] = useState<ContentSection>('general');

  const categories = [
    'All Stories',
    'Nutrition',
    'Mental Health',
    'Sleep',
    'Movement',
    'Recovery',
  ];

  const pillars = [
    { icon: '🍽️', title: 'Nutrition', color: 'pink' },
    { icon: '🧠', title: 'Mindset', color: 'green' },
    { icon: '😴', title: 'Rest', color: 'purple' },
    { icon: '🧘', title: 'Movement', color: 'teal' },
  ];

  // Helper function to map article data to ArticleCard props
  const mapArticleToCard = (article: Article) => {
    // Determine background color based on category
    const bgColorMap: Record<string, string> = {
      'nutrition': 'bg-green-100',
      'mental-health': 'bg-purple-100',
      'sleep': 'bg-blue-100',
      'movement': 'bg-teal-100',
      'recovery': 'bg-orange-100',
      'health': 'bg-pink-100',
      'mindfulness': 'bg-indigo-100',
    };

    return {
      category: article.category.toUpperCase().replace('-', ' '),
      title: article.title,
      description: article.excerpt,
      readTime: article.readTime ? `${article.readTime} min` : '5 min',
      likes: article.likes > 0 ? article.likes.toString() : '0',
      author: article.author,
      icon: article.category === 'nutrition' ? '🥗' : article.category === 'movement' ? '🤸‍♀️' : undefined,
      bgColor: bgColorMap[article.category] || 'bg-gray-100',
    };
  };

  // Helper function to map video data to VideoCard props
  const mapVideoToCard = (video: Video) => {
    return {
      title: video.title,
      duration: video.duration || '0:00',
      views: video.views > 0 ? `${(video.views / 1000).toFixed(0)}k` : '0',
      category: video.category.toUpperCase().replace('-', ' '),
    };
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const loadUserData = async () => {
      try {
        const profile = await getUserProfile(user.uid);
        if (profile?.displayName) {
          setUserName(profile.displayName.split(' ')[0]);
        } else if (user.email) {
          setUserName(user.email.split('@')[0]);
        }

        // Check if user is in period tracker mode
        const onboardingData = await getOnboardingData(user.uid);
        setIsPeriodTracker(onboardingData?.currentStage === 'period');

        // Determine if user is in postpartum stage
        setShowRecovery(profile?.currentStage === 'postpartum');

        // Determine user's section based on their stage
        let section: ContentSection = 'general';
        if (profile?.currentStage === 'period') {
          section = 'period';
        } else if (profile?.currentStage === 'planning') {
          section = 'pre-pregnancy';
        } else if (profile?.currentStage === 'pregnancy') {
          section = 'pregnancy';
        } else if (profile?.currentStage === 'postpartum') {
          section = 'postpartum';
        }
        setUserSection(section);

        // Fetch articles and videos for user's section
        const [articlesData, videosData] = await Promise.all([
          getArticlesBySection(section, 6),
          getVideosBySection(section, 4)
        ]);

        setArticles(articlesData);
        setVideos(videosData);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, router]);

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <motion.p
            className="mt-4 text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Loading...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 relative overflow-hidden">
      {/* Floating Leaves Animation */}
      <FloatingLeaves />

      {/* Use Period Tracker Header if in period mode */}
      {isPeriodTracker ? (
        <PeriodTrackerHeader userName={userName} />
      ) : (
        <DashboardHeader userName={userName} showRecovery={showRecovery} />
      )}

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 font-serif">
            The Sanctuary
          </h1>
          <p className="text-lg text-gray-600">
            Curated wisdom for your wellness journey
          </p>
        </motion.div>

        {/* Category Pills */}
        <div className="mb-8">
          <CategoryPills
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Featured Article */}
        <div className="mb-12">
          <FeaturedArticle
            badge="RECOMMENDED FOR YOU"
            readTime="12 MIN READ"
            title="Finding Your Inner Calm: A Guide to Post-Natal Mindfulness"
            description="Rediscover peace in the beautiful chaos of early motherhood with these expert-led techniques."
            image="/featured-article.jpg"
            category="Mindfulness"
          />
        </div>

        {/* Explore Pillars */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">
            Explore Pillars
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pillars.map((pillar, index) => (
              <PillarCard key={index} {...pillar} />
            ))}
          </div>
        </motion.div>

        {/* Latest Wisdom */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 font-serif">
              Latest Wisdom
            </h2>
            <button className="text-purple-600 font-semibold hover:text-purple-700 transition-colors">
              View All Archive →
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.length > 0 ? (
              articles.map((article, index) => (
                <ArticleCard key={article.id} {...mapArticleToCard(article)} />
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-gray-500">
                No articles available for your stage yet. Check back soon!
              </div>
            )}
          </div>
        </motion.div>

        {/* Video Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 font-serif">
              Video Library
            </h2>
            <button className="text-purple-600 font-semibold hover:text-purple-700 transition-colors">
              View All Videos →
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.length > 0 ? (
              videos.map((video, index) => (
                <VideoCard key={video.id} {...mapVideoToCard(video)} />
              ))
            ) : (
              <div className="col-span-4 text-center py-8 text-gray-500">
                No videos available for your stage yet. Check back soon!
              </div>
            )}
          </div>
        </motion.div>

        {/* Newsletter Banner */}
        <NewsletterBanner />
      </main>
    </div>
  );
}
