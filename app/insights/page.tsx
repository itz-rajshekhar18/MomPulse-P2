'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getUserProfile, getUserCycles } from '@/lib/firestore';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MetricCard from '@/components/insights/MetricCard';
import AIInsightCard from '@/components/insights/AIInsightCard';
import CycleLengthTrend from '@/components/insights/CycleLengthTrend';
import NextCyclePredictions from '@/components/insights/NextCyclePredictions';
import FertilityWindowTimeline from '@/components/insights/FertilityWindowTimeline';
import RecommendationsCard from '@/components/insights/RecommendationsCard';
import MoodEnergyChart from '@/components/insights/MoodEnergyChart';
import FloatingLeaves from '@/components/animations/FloatingLeaves';
import CycleLogModal from '@/components/insights/CycleLogModal';
import { usePeriodPrediction } from '@/lib/usePeriodPrediction';
import { motion } from 'framer-motion';

export default function InsightsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [hasCycleData, setHasCycleData] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cycles, setCycles] = useState<any[]>([]);
  const { prediction, insights: mlInsights, loading: predictionLoading } = usePeriodPrediction();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const loadUserData = async () => {
      try {
        const profile = await getUserProfile(user.uid);

        // Set user name
        if (profile?.displayName) {
          setUserName(profile.displayName.split(' ')[0]);
        } else if (user.email) {
          setUserName(user.email.split('@')[0]);
        }

        // Check if user has cycle data
        const cyclesData = await getUserCycles(user.uid);
        setCycles(cyclesData);
        setHasCycleData(cyclesData.length > 0);
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
      const cyclesData = await getUserCycles(user.uid);
      setCycles(cyclesData);
      setHasCycleData(cyclesData.length > 0);
    }
  };

  if (loading || predictionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 relative">
      {/* Floating Leaves Background */}
      <FloatingLeaves />

      {/* Dashboard Header */}
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

      {/* Main Content */}
      <main className="py-8 px-6 relative z-10">
        <div className="max-w-7xl mx-auto relative">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 font-serif flex items-center gap-3">
              Your Fertility Insights
              <span className="text-4xl">🌱</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Understand your cycle and plan your journey to motherhood
            </p>
          </div>

          {/* Blur Overlay when no cycle data */}
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

          {/* Blurred Content */}
          <div className={hasCycleData ? '' : 'blur-sm pointer-events-none select-none'}>
            {/* Metrics Row */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
            <MetricCard
              label="AVERAGE CYCLE LENGTH"
              value={prediction?.avg_cycle_length?.toString() || "28"}
              unit="days"
              color="purple"
              delay={0.1}
            />
            <MetricCard
              label="CYCLE REGULARITY"
              value={prediction?.cycle_regularity ? prediction.cycle_regularity.charAt(0).toUpperCase() + prediction.cycle_regularity.slice(1) : "Stable"}
              status="stable"
              color="green"
              delay={0.15}
            />
            <MetricCard
              label="PREDICTION CONFIDENCE"
              value={prediction?.confidence ? prediction.confidence.charAt(0).toUpperCase() + prediction.confidence.slice(1) : "Medium"}
              status="high"
              color="purple"
              delay={0.2}
            />
          </div>

          {/* AI Insights */}
          <div className="mb-8">
            <AIInsightCard
              message={
                mlInsights.length > 0
                  ? mlInsights.map(i => i.text).join(' ')
                  : prediction
                  ? `Based on ${prediction.data_points} cycles logged, your average cycle length is ${Math.round(prediction.avg_cycle_length)} days. Your cycle is ${prediction.cycle_regularity}. Next ovulation predicted on ${new Date(prediction.ovulation_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}.`
                  : "Your cycle has been exceptionally consistent over the last 4 months. Based on your basal body temperature and activity levels, we predict your peak fertility window will start 2 days earlier next month. Consider increasing your leafy green intake to support your follicular phase."
              }
              delay={0.25}
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Left Column - Cycle Trend */}
            <div className="lg:col-span-2">
              <CycleLengthTrend cycles={cycles} />
            </div>

            {/* Right Column - Predictions */}
            <div>
              <NextCyclePredictions prediction={prediction} />
            </div>
          </div>

          {/* Fertility Window Timeline */}
          <div className="mb-8">
            <FertilityWindowTimeline prediction={prediction} />
          </div>

            {/* Bottom Row - Recommendations and Mood */}
            <div className="grid lg:grid-cols-2 gap-8">
              <RecommendationsCard prediction={prediction} cycles={cycles} />
              <MoodEnergyChart cycles={cycles} />
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Spacing */}
      <div className="h-24"></div>
    </div>
  );
}
