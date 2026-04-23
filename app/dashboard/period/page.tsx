'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserProfile } from '@/lib/firestore';
import PeriodTrackerHeader from '@/components/dashboard/PeriodTrackerHeader';
import CycleProgressCard from '@/components/dashboard/CycleProgressCard';
import TodaysVibe from '@/components/dashboard/TodaysVibe';
import CycleCalendar from '@/components/dashboard/CycleCalendar';
import SelfCareHack from '@/components/dashboard/SelfCareHack';
import WeeklyStats from '@/components/dashboard/WeeklyStats';
import QuickActionButtons from '@/components/dashboard/QuickActionButtons';
import CommunityCards from '@/components/dashboard/CommunityCards';
import FloatingLeaves from '@/components/animations/FloatingLeaves';
import AnimatedCard from '@/components/animations/AnimatedCard';
import FadeInView from '@/components/animations/FadeInView';
import { motion } from 'framer-motion';

export default function PeriodTrackerDashboard() {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 relative overflow-hidden">
      {/* Floating Leaves Animation */}
      <FloatingLeaves />

      <PeriodTrackerHeader userName={userName} />

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cycle Progress Card */}
            <AnimatedCard delay={0.1}>
              <CycleProgressCard />
            </AnimatedCard>

            {/* Quick Action Buttons */}
            <AnimatedCard delay={0.2}>
              <QuickActionButtons />
            </AnimatedCard>

            {/* Community Cards */}
            <AnimatedCard delay={0.3}>
              <CommunityCards />
            </AnimatedCard>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Today's Vibe */}
            <AnimatedCard delay={0.1}>
              <TodaysVibe />
            </AnimatedCard>

            {/* Cycle Calendar */}
            <AnimatedCard delay={0.2}>
              <CycleCalendar />
            </AnimatedCard>

            {/* Self Care Hack */}
            <AnimatedCard delay={0.3}>
              <SelfCareHack />
            </AnimatedCard>

            {/* Weekly Stats */}
            <AnimatedCard delay={0.4}>
              <WeeklyStats />
            </AnimatedCard>
          </div>
        </div>
      </main>
    </div>
  );
}
