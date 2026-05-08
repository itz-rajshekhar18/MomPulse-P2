'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserProfile, getPregnancyInfo, getLatestPregnancyLog } from '@/lib/firestore';
import PregnancyHeader from '@/components/pregnancy/PregnancyHeader';
import BabyGrowthCard from '@/components/pregnancy/BabyGrowthCard';
import AIInsightCard from '@/components/pregnancy/AIInsightCard';
import UpcomingSessionCard from '@/components/pregnancy/UpcomingSessionCard';
import QuickActionsGrid from '@/components/pregnancy/QuickActionsGrid';
import RecommendedContent from '@/components/pregnancy/RecommendedContent';
import FloatingLeaves from '@/components/animations/FloatingLeaves';
import { motion } from 'framer-motion';

export default function PregnancyDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [pregnancyInfo, setPregnancyInfo] = useState<any>(null);
  const [latestLog, setLatestLog] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const loadUserData = async () => {
      try {
        const profile = await getUserProfile(user.uid);
        
        // Access control: Only allow users with 'pregnancy' stage
        if (profile?.currentStage && profile.currentStage !== 'pregnancy') {
          console.warn('Access denied: User stage does not match pregnancy');
          router.push('/dashboard');
          return;
        }
        
        if (profile?.displayName) {
          setUserName(profile.displayName.split(' ')[0]);
        } else if (user.email) {
          setUserName(user.email.split('@')[0]);
        }

        // Load pregnancy information
        const pregInfo = await getPregnancyInfo(user.uid);
        setPregnancyInfo(pregInfo);

        // Load latest pregnancy log
        const log = await getLatestPregnancyLog(user.uid);
        setLatestLog(log);
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
            Loading your sanctuary...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Calculate pregnancy details
  const currentWeek = pregnancyInfo?.currentWeek || 24;
  const trimester = Math.ceil(currentWeek / 13.33);
  const progress = Math.round((currentWeek / 40) * 100);

  // Baby size comparisons by week
  const getBabyComparison = (week: number): string => {
    if (week <= 4) return 'Poppy Seed';
    if (week <= 8) return 'Raspberry';
    if (week <= 12) return 'Lime';
    if (week <= 16) return 'Avocado';
    if (week <= 20) return 'Banana';
    if (week <= 24) return 'Cantaloupe';
    if (week <= 28) return 'Eggplant';
    if (week <= 32) return 'Pineapple';
    if (week <= 36) return 'Honeydew';
    return 'Watermelon';
  };

  const getBabyWeight = (week: number): string => {
    if (week <= 12) return '30g';
    if (week <= 16) return '100g';
    if (week <= 20) return '300g';
    if (week <= 24) return '600g';
    if (week <= 28) return '1kg';
    if (week <= 32) return '1.7kg';
    if (week <= 36) return '2.5kg';
    return '3.3kg';
  };

  // AI Insights based on latest log
  const getAIInsight = () => {
    if (!latestLog) {
      return {
        title: "Your baby's hearing is developing this week 💜",
        message: "Start talking or playing soft music; they can now recognize the muffled sound of your voice and heartbeat.",
        icon: "👂"
      };
    }

    if (latestLog.wellness_score && latestLog.wellness_score < 50) {
      return {
        title: "Take it easy today",
        message: "Your wellness score suggests you need more rest. Consider a gentle walk and ensure you're staying hydrated.",
        icon: "💆‍♀️"
      };
    }

    if (latestLog.energy < 5) {
      return {
        title: "Boost your energy naturally",
        message: "Try eating small, frequent meals with protein and complex carbs. A short nap can also help recharge.",
        icon: "⚡"
      };
    }

    return {
      title: "You're doing great!",
      message: "Your wellness metrics look good. Keep up the healthy habits and remember to stay active within your comfort zone.",
      icon: "✨"
    };
  };

  const aiInsight = getAIInsight();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 relative overflow-hidden">
      {/* Floating Leaves Animation */}
      <FloatingLeaves />

      <PregnancyHeader userName={userName} />

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-serif">
            Hi, {userName} 🤰
          </h1>
          <p className="text-gray-600">
            Your sanctuary for a healthy, happy journey today.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="space-y-6">
          {/* Baby Growth Card - Full Width */}
          <BabyGrowthCard
            week={currentWeek}
            trimester={trimester}
            comparison={getBabyComparison(currentWeek)}
            weight={getBabyWeight(currentWeek)}
            progress={progress}
          />

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* AI Insight */}
              <AIInsightCard
                title={aiInsight.title}
                message={aiInsight.message}
                icon={aiInsight.icon}
              />

              {/* Quick Actions */}
              <QuickActionsGrid />

              {/* Recommended Content */}
              <RecommendedContent />
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              {/* Upcoming Session */}
              <UpcomingSessionCard
                doctorName="Dr. Sarah Mitchell"
                specialty="Prenatal Check-up"
                date="Tomorrow, May 7"
                time="2:30 PM"
              />

              {/* Wellness Summary Card */}
              {latestLog && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4 font-serif">
                    Today's Wellness
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Wellness Score</span>
                        <span className="text-2xl font-bold text-purple-600">
                          {latestLog.wellness_score || 0}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                          style={{ width: `${latestLog.wellness_score || 0}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 mb-2">
                        Status: <span className="text-purple-600">{latestLog.risk_level || 'Good'}</span>
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500">Energy</p>
                          <p className="font-semibold">{latestLog.energy}/10</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Sleep</p>
                          <p className="font-semibold">{latestLog.sleep}h</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Hydration</p>
                          <p className="font-semibold">{latestLog.water_pct}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Diet</p>
                          <p className="font-semibold">{latestLog.diet_pct}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
