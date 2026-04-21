'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserProfile } from '@/lib/firestore';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import FertilityCard from '@/components/dashboard/FertilityCard';
import DailyInsight from '@/components/dashboard/DailyInsight';
import HealthOverview from '@/components/dashboard/HealthOverview';
import PreconceptionLibrary from '@/components/dashboard/PreconceptionLibrary';
import UpcomingSessions from '@/components/dashboard/UpcomingSessions';
import BottomNavigation from '@/components/dashboard/BottomNavigation';
import FloatingLeaves from '@/components/animations/FloatingLeaves';
import AnimatedCard from '@/components/animations/AnimatedCard';
import FadeInView from '@/components/animations/FadeInView';
import { motion } from 'framer-motion';

export default function PrePregnancyDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);

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
            Loading your dashboard...
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
        {/* Greeting with Animation */}
        <FadeInView delay={0.1}>
          <div className="mb-8">
            <motion.h1 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-serif"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              Good morning, {userName || 'Sarah'} 🌸
            </motion.h1>
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Your body is preparing for a new journey. We're here to support every step of your preconception wellness.
            </motion.p>
          </div>
        </FadeInView>

        {/* Main Content Grid with Staggered Animations */}
        <div className="space-y-6">
          {/* Fertility Card */}
          <AnimatedCard delay={0.2}>
            <FertilityCard />
          </AnimatedCard>

          {/* Daily Insight */}
          <AnimatedCard delay={0.3}>
            <DailyInsight />
          </AnimatedCard>

          {/* Health Overview */}
          <AnimatedCard delay={0.4}>
            <HealthOverview />
          </AnimatedCard>

          {/* Preconception Library */}
          <AnimatedCard delay={0.5}>
            <PreconceptionLibrary />
          </AnimatedCard>

          {/* Upcoming Sessions */}
          <AnimatedCard delay={0.6}>
            <UpcomingSessions />
          </AnimatedCard>
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <BottomNavigation />
    </div>
  );
}
