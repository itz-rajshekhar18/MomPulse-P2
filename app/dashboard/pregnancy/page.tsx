'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { getUserProfile, getPregnancyInfo, getLatestPregnancyLog, getUpcomingSessions } from '@/lib/firestore';
import PregnancyDateModal from '@/components/pregnancy/PregnancyDateModal';
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
  const [showDateModal, setShowDateModal] = useState(false);
  const [aiInsight, setAiInsight] = useState<{ title: string; message: string; icon: string } | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [upcomingSession, setUpcomingSession] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const loadUserData = useCallback(async () => {
    if (!user) return;
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

      if (!pregInfo || (!pregInfo.lastMenstrualPeriod && !pregInfo.dueDate)) {
        setShowDateModal(true);
      } else {
        setShowDateModal(false);
      }

      // Load latest pregnancy log
      const log = await getLatestPregnancyLog(user.uid);
      setLatestLog(log);

      // Load upcoming sessions
      try {
        const sessions = await getUpcomingSessions(1);
        if (sessions && sessions.length > 0) {
          setUpcomingSession(sessions[0]);
        }
      } catch (err) {
        console.error('Failed to load upcoming sessions', err);
      } finally {
        setLoadingSession(false);
      }

      // Generate AI Insight
      if (!aiInsight && !loadingInsight) {
        setLoadingInsight(true);
        try {
          const insightRes = await fetch('/api/ai/insight', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              stage: 'Pregnancy',
              insightType: 'daily_wellness',
              contextData: {
                currentWeek: pregInfo?.currentWeek || 0,
                wellnessScore: log?.wellness_score,
                energy: log?.energy,
                sleep: log?.sleep,
                riskLevel: log?.risk_level
              }
            })
          });
          if (insightRes.ok) {
            const insightData = await insightRes.json();
            setAiInsight(insightData);
          }
        } catch (err) {
          console.error('Failed to load AI insight', err);
        } finally {
          setLoadingInsight(false);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  }, [user, router]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadUserData();
  }, [user, router, loadUserData]);

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

  // Calculate pregnancy details dynamically
  let currentWeek = 0;
  if (pregnancyInfo?.lastMenstrualPeriod) {
    const now = new Date();
    const lmpDate = new Date(pregnancyInfo.lastMenstrualPeriod);
    const diffTime = Math.abs(now.getTime() - lmpDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    currentWeek = Math.min(42, Math.floor(diffDays / 7));
  } else if (pregnancyInfo?.currentWeek) {
    currentWeek = pregnancyInfo.currentWeek;
  }

  const trimester = Math.ceil(currentWeek / 13.33) || 1;
  const progress = Math.round((currentWeek / 40) * 100) || 0;

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

  // Removed hardcoded getAIInsight

  return (
    <>
      {user && (
        <PregnancyDateModal 
          isOpen={showDateModal} 
          userId={user.uid} 
          onSuccess={loadUserData} 
        />
      )}
      <div className={`min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 relative overflow-hidden transition-all duration-500 ${showDateModal ? 'blur-md pointer-events-none' : ''}`}>
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
                title={aiInsight?.title}
                message={aiInsight?.message}
                icon={aiInsight?.icon}
                isLoading={loadingInsight}
              />

              {/* Quick Actions */}
              <QuickActionsGrid />

              {/* Recommended Content */}
              <RecommendedContent currentWeek={currentWeek} />
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              {/* Upcoming Session */}
              <UpcomingSessionCard
                doctorName={upcomingSession?.instructor || upcomingSession?.title}
                specialty={upcomingSession?.category}
                date={upcomingSession?.date}
                time={upcomingSession?.time}
                isLoading={loadingSession}
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
    </>
  );
}
