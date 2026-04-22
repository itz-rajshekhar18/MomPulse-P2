'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getUserProfile } from '@/lib/firestore';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import CreatePostCard from '@/components/community/CreatePostCard';
import TopicPill from '@/components/community/TopicPill';
import CommunityPost from '@/components/community/CommunityPost';
import TrendingTopics from '@/components/community/TrendingTopics';
import TopContributors from '@/components/community/TopContributors';
import WeeklyTip from '@/components/community/WeeklyTip';
import FloatingLeaves from '@/components/animations/FloatingLeaves';
import { motion } from 'framer-motion';

export default function CommunityPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeTopic, setActiveTopic] = useState('Postpartum Recovery');

  const topics = [
    'Postpartum Recovery',
    'Breastfeeding',
    'Mental Wellness',
    'Toddler Years',
    'Sleep Training',
  ];

  const trendingTopics = [
    { rank: 1, title: 'Gentle Weaning Tips', posts: '420 posts this week' },
    { rank: 2, title: 'Self-Care Sunday', posts: '315 posts this week' },
    { rank: 3, title: 'Toddler Meal Prep', posts: '280 posts this week' },
  ];

  const topContributors = [
    { name: 'Dr. Maya Chen', role: 'Wellness Expert', avatar: '👩‍⚕️' },
    { name: 'Jessica Rae', role: 'Community Star', avatar: '⭐' },
    { name: 'Sophie T.', role: 'Supportive Voice', avatar: '💜' },
  ];

  const posts = [
    {
      author: 'Sarah Mitchell',
      timeAgo: '2 hours ago',
      category: 'Postpartum Recovery',
      content:
        "Finally feeling like myself again after 6 months. It's been a slow journey of re-discovering my strength, but today's morning yoga felt different. To any mama in the thick of it: it gets better, one gentle breath at a time. 🌱",
      image: '/post-image.jpg',
      likes: 124,
      comments: 18,
    },
    {
      author: 'Elena K.',
      timeAgo: '5 hours ago',
      category: 'Toddler Years',
      content:
        "The 'terrible twos' are really just the 'tremendous twos' in disguise, right? Exploring the park today reminded me how much wonder there is in the smallest things. Like a very specific yellow leaf. 🍂",
      likes: 89,
      comments: 12,
    },
    {
      author: 'Priya Sharma',
      timeAgo: '8 hours ago',
      category: 'Mental Wellness',
      content:
        "Started therapy last month and it's been transformative. To any mama struggling: asking for help is not weakness, it's wisdom. You deserve support. 💜",
      likes: 156,
      comments: 24,
    },
    {
      author: 'Amanda Lee',
      timeAgo: '12 hours ago',
      category: 'Breastfeeding',
      content:
        "6 months of breastfeeding! It wasn't easy at first, but we found our rhythm. Grateful for this community's support during those tough early days. 🤱",
      likes: 98,
      comments: 15,
    },
    {
      author: 'Rachel Green',
      timeAgo: '1 day ago',
      category: 'Sleep Training',
      content:
        "Night 3 of gentle sleep training and we're seeing progress! Baby slept for 4 hours straight. Small wins feel like huge victories. 😴✨",
      likes: 112,
      comments: 20,
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

      <DashboardHeader userName={userName} />

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 font-serif">
            Community
          </h1>
          <p className="text-lg text-gray-600">
            Connect, share, and support each other on this journey
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_350px] gap-8">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Discover Topics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4">Discover Topics</h2>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {topics.map((topic) => (
                  <TopicPill
                    key={topic}
                    label={topic}
                    isActive={activeTopic === topic}
                    onClick={() => setActiveTopic(topic)}
                  />
                ))}
              </div>
            </motion.div>

            {/* Create Post */}
            <CreatePostCard userName={userName} />

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map((post, index) => (
                <CommunityPost key={index} {...post} index={index} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <TrendingTopics topics={trendingTopics} />

            {/* Top Contributors */}
            <TopContributors contributors={topContributors} />

            {/* Weekly Tip */}
            <WeeklyTip tip="Taking 5 minutes for deep breathing today isn't a luxury—it's essential maintenance." />
          </div>
        </div>
      </main>
    </div>
  );
}
