'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserProfile } from '@/lib/firestore';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import RecoveryProgressCard from '@/components/dashboard/RecoveryProgressCard';
import WellnessSummary from '@/components/dashboard/WellnessSummary';
import PersonalGuidance from '@/components/dashboard/PersonalGuidance';
import QuickAccessGrid from '@/components/dashboard/QuickAccessGrid';
import CuratedContent from '@/components/dashboard/CuratedContent';
import UpcomingSessions from '@/components/dashboard/UpcomingSessions';
import FloatingLeaves from '@/components/animations/FloatingLeaves';
import AnimatedCard from '@/components/animations/AnimatedCard';
import FadeInView from '@/components/animations/FadeInView';
import { motion } from 'framer-motion';

export default function PostPregnancyDashboard() {
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

      <DashboardHeader userName={userName} showRecovery={true} />

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
              Welcome back, {userName || 'Sarah'} 🌸
            </motion.h1>
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              You're doing incredible work. Take a deep breath—today is for you.
            </motion.p>
          </div>
        </FadeInView>

        {/* Main Content Grid with Staggered Animations */}
        <div className="space-y-6">
          {/* Recovery Progress and Wellness Summary Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AnimatedCard delay={0.2}>
                <RecoveryProgressCard />
              </AnimatedCard>
            </div>
            <div>
              <AnimatedCard delay={0.3}>
                <WellnessSummary />
              </AnimatedCard>
            </div>
          </div>

          {/* Quick Access Grid and Personal Guidance Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <AnimatedCard delay={0.4}>
                <QuickAccessGrid />
              </AnimatedCard>
            </div>
            <div className="lg:col-span-2">
              <AnimatedCard delay={0.5}>
                <PersonalGuidance />
              </AnimatedCard>
            </div>
          </div>

          {/* Curated Content */}
          <AnimatedCard delay={0.6}>
            <CuratedContent />
          </AnimatedCard>

          {/* Upcoming Sessions */}
          <AnimatedCard delay={0.7}>
            <UpcomingSessions />
          </AnimatedCard>
        </div>
      </main>
    </div>
  );
}
