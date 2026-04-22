'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserProfile, getUserCycles } from '@/lib/firestore';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import FertilityCard from '@/components/dashboard/FertilityCard';
import DailyInsight from '@/components/dashboard/DailyInsight';
import HealthOverview from '@/components/dashboard/HealthOverview';
import PreconceptionLibrary from '@/components/dashboard/PreconceptionLibrary';
import UpcomingSessions from '@/components/dashboard/UpcomingSessions';
import FloatingLeaves from '@/components/animations/FloatingLeaves';
import AnimatedCard from '@/components/animations/AnimatedCard';
import FadeInView from '@/components/animations/FadeInView';
import CycleLogModal from '@/components/insights/CycleLogModal';
import { motion } from 'framer-motion';

export default function PrePregnancyDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [hasCycleData, setHasCycleData] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

        // Check if user has cycle data
        const cycles = await getUserCycles(user.uid);
        setHasCycleData(cycles.length > 0);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, router]);

  const handleCycleSuccess = async () => {
    setShowModal(false);
    // Reload cycle data
    if (user) {
      const cycles = await getUserCycles(user.uid);
      setHasCycleData(cycles.length > 0);
    }
  };

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

      {/* Cycle Log Modal */}
      {user && (
        <CycleLogModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={handleCycleSuccess}
          userId={user.uid}
        />
      )}

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
          {/* Fertility Card with Blur Overlay */}
          <div className="relative">
            {/* Blur Overlay when no cycle data - Only on Fertility Card */}
            {!hasCycleData && (
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-4 text-center"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 font-serif">
                    Start Tracking Your Cycle
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Log your period cycle to unlock ML-powered predictions, personalized insights, and fertility tracking.
                  </p>
                  <button
                    onClick={() => setShowModal(true)}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    Log Your First Cycle
                  </button>
                </motion.div>
              </div>
            )}

            {/* Fertility Card - Blurred when no data */}
            <div className={hasCycleData ? '' : 'blur-sm pointer-events-none select-none'}>
              <AnimatedCard delay={0.2}>
                <FertilityCard />
              </AnimatedCard>
            </div>
          </div>

          {/* Daily Insight - Not Blurred */}
          <AnimatedCard delay={0.3}>
            <DailyInsight />
          </AnimatedCard>

          {/* Health Overview - Not Blurred */}
          <AnimatedCard delay={0.4}>
            <HealthOverview />
          </AnimatedCard>

          {/* Preconception Library - Not Blurred */}
          <AnimatedCard delay={0.5}>
            <PreconceptionLibrary />
          </AnimatedCard>

          {/* Upcoming Sessions - Not Blurred */}
          <AnimatedCard delay={0.6}>
            <UpcomingSessions />
          </AnimatedCard>
        </div>
      </main>
    </div>
  );
}
