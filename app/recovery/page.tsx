'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserProfile, getDeliveryInfo } from '@/lib/firestore';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import RecoveryTimeline from '@/components/recovery/RecoveryTimeline';
import DailyCheckIn from '@/components/recovery/DailyCheckIn';
import DailyCareTip from '@/components/recovery/DailyCareTip';
import RecoveryMetrics from '@/components/recovery/RecoveryMetrics';
import DoctorConsultAlert from '@/components/recovery/DoctorConsultAlert';
import WeeklyImprovement from '@/components/recovery/WeeklyImprovement';
import RecoveryTrendsChart from '@/components/recovery/RecoveryTrendsChart';
import UpcomingConsultations from '@/components/recovery/UpcomingConsultations';
import RecommendedContent from '@/components/recovery/RecommendedContent';
import DeliverySetupModal from '@/components/recovery/DeliverySetupModal';
import FloatingLeaves from '@/components/animations/FloatingLeaves';
import { motion } from 'framer-motion';

export default function RecoveryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [hasDeliveryInfo, setHasDeliveryInfo] = useState(false);
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

        // Check if user has delivery info
        const deliveryInfo = await getDeliveryInfo(user.uid);
        setHasDeliveryInfo(!!deliveryInfo);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, router]);

  const handleSetupSuccess = async () => {
    setShowModal(false);
    setHasDeliveryInfo(true);
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
            Loading your recovery journey...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
      {/* Floating Leaves Animation */}
      <FloatingLeaves />

      <DashboardHeader userName={userName} showRecovery={true} section="postpartum" />

      {/* Delivery Setup Modal */}
      {user && (
        <DeliverySetupModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={handleSetupSuccess}
          userId={user.uid}
        />
      )}

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            Recovery Journey 🌻
          </h1>
          <p className="text-gray-600">Take care of yourself, one step at a time</p>
        </div>

        {/* Content with Blur Overlay */}
        <div className="relative">
          {/* Blur Overlay when no delivery info */}
          {!hasDeliveryInfo && (
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 font-serif">
                  Start Your Recovery Journey
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Tell us about your delivery to unlock ML-powered recovery tracking, personalized insights, and risk assessments tailored to your healing journey.
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Set Up Recovery Tracking
                </button>
              </motion.div>
            </div>
          )}

          {/* Main Content - Blurred when no delivery info */}
          <div className={hasDeliveryInfo ? '' : 'blur-sm pointer-events-none select-none'}>
            {/* Timeline Row */}
            <div className="mb-6">
              <RecoveryTimeline />
            </div>

            {/* Recovery Trends Chart and Daily Check-in Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <RecoveryTrendsChart />
              </div>
              <div>
                <DailyCheckIn />
              </div>
            </div>

            {/* Daily Care Tip */}
            <div className="mb-6">
              <DailyCareTip />
            </div>

            {/* Recovery Metrics */}
            <div className="mb-6">
              <RecoveryMetrics />
            </div>

            {/* Doctor Consult Alert and Weekly Improvement */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <DoctorConsultAlert />
              <WeeklyImprovement />
            </div>

            {/* Upcoming Consultations */}
            <div className="mb-6">
              <UpcomingConsultations />
            </div>

            {/* Recommended Content */}
            <div className="mb-6">
              <RecommendedContent />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
