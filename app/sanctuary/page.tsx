'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getUserProfile, getOnboardingData } from '@/lib/firestore';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PeriodTrackerHeader from '@/components/dashboard/PeriodTrackerHeader';
import BottomNavigation from '@/components/dashboard/BottomNavigation';
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

  const articles = [
    {
      category: 'NUTRITION',
      title: 'The Anti-Inflammatory Kitchen: Top 10 Essentials',
      readTime: '8 min',
      likes: '1.2k',
      icon: '🥗',
      bgColor: 'bg-green-100',
    },
    {
      category: 'SLEEP SCIENCE',
      title: 'Circadian Rhythms & Post-Partum Hormones',
      description: 'Understanding the interplay and that dictates your sleep patterns during the first year of motherhood.',
      readTime: '6 min',
      likes: '856',
      author: 'Dr. Sarah Jenkins',
      authorAvatar: '👩‍⚕️',
      bgColor: 'bg-blue-100',
    },
    {
      category: 'MENTAL HEALTH',
      title: 'Micro-Meditations: Finding 5 Minutes of Zen',
      readTime: '5 min',
      likes: '1.5k',
      icon: '🧘',
      bgColor: 'bg-purple-100',
    },
    {
      category: 'NUTRITION',
      title: 'Postpartum Nutrition: Healing Foods for Recovery',
      description: 'Essential nutrients and meal ideas to support your body during the fourth trimester.',
      readTime: '10 min',
      likes: '2.1k',
      author: 'Emma Rodriguez',
      bgColor: 'bg-orange-100',
    },
    {
      category: 'MOVEMENT',
      title: 'Gentle Yoga for New Mothers',
      readTime: '7 min',
      likes: '943',
      icon: '🤸‍♀️',
      bgColor: 'bg-teal-100',
    },
    {
      category: 'SLEEP',
      title: 'Sleep Training: Evidence-Based Approaches',
      description: 'What the research says about different sleep training methods and finding what works for your family.',
      readTime: '12 min',
      likes: '1.8k',
      author: 'Dr. Michael Chen',
      authorAvatar: '👨‍⚕️',
      bgColor: 'bg-indigo-100',
    },
  ];

  const videos = [
    {
      title: '10-Minute Morning Yoga for Pregnancy',
      duration: '10:24',
      views: '45k',
      category: 'MOVEMENT',
    },
    {
      title: 'Breathing Techniques for Labor',
      duration: '8:15',
      views: '32k',
      category: 'MINDSET',
    },
    {
      title: 'Meal Prep for New Moms',
      duration: '15:30',
      views: '28k',
      category: 'NUTRITION',
    },
    {
      title: 'Postpartum Core Strengthening',
      duration: '12:45',
      views: '38k',
      category: 'RECOVERY',
    },
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 pb-20 md:pb-0 relative overflow-hidden">
      {/* Floating Leaves Animation */}
      <FloatingLeaves />

      {/* Use Period Tracker Header if in period mode */}
      {isPeriodTracker ? (
        <PeriodTrackerHeader userName={userName} />
      ) : (
        <DashboardHeader userName={userName} />
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
            {articles.map((article, index) => (
              <ArticleCard key={index} {...article} />
            ))}
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
            {videos.map((video, index) => (
              <VideoCard key={index} {...video} />
            ))}
          </div>
        </motion.div>

        {/* Newsletter Banner */}
        <NewsletterBanner />
      </main>

      {/* Bottom Navigation for Mobile */}
      <BottomNavigation />
    </div>
  );
}
