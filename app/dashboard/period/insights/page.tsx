'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserProfile, getUserCycles } from '@/lib/firestore';
import PeriodTrackerHeader from '@/components/dashboard/PeriodTrackerHeader';
import CycleTrendChart from '@/components/dashboard/CycleTrendChart';
import FloatingLeaves from '@/components/animations/FloatingLeaves';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Calendar, Activity } from 'lucide-react';

export default function InsightsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [cycles, setCycles] = useState<any[]>([]);
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [regularity, setRegularity] = useState('High');
  const [viewMode, setViewMode] = useState<'day' | 'month'>('month');
  const [hasLoggedCycle, setHasLoggedCycle] = useState(false);

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

        const userCycles = await getUserCycles(user.uid);
        setCycles(userCycles);
        setHasLoggedCycle(userCycles.length > 0);

        if (userCycles.length > 0) {
          // Calculate average cycle length
          let totalCycleLength = 0;
          for (let i = 1; i < userCycles.length; i++) {
            const prevStart = new Date(userCycles[i - 1].start_date);
            const currentStart = new Date(userCycles[i].start_date);
            const diff = Math.floor((currentStart.getTime() - prevStart.getTime()) / (1000 * 60 * 60 * 24));
            totalCycleLength += diff;
          }
          const avgCycleLength = userCycles.length > 1 ? Math.round(totalCycleLength / (userCycles.length - 1)) : 28;
          setCycleLength(avgCycleLength);

          // Calculate average period length
          const avgPeriodLength = Math.round(
            userCycles.reduce((sum, cycle) => {
              const start = new Date(cycle.start_date);
              const end = new Date(cycle.end_date);
              return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            }, 0) / userCycles.length
          );
          setPeriodLength(avgPeriodLength);

          // Calculate regularity
          if (userCycles.length >= 3) {
            const cycleLengths = [];
            for (let i = 1; i < userCycles.length; i++) {
              const prevStart = new Date(userCycles[i - 1].start_date);
              const currentStart = new Date(userCycles[i].start_date);
              cycleLengths.push(Math.floor((currentStart.getTime() - prevStart.getTime()) / (1000 * 60 * 60 * 24)));
            }
            const variance = Math.max(...cycleLengths) - Math.min(...cycleLengths);
            setRegularity(variance <= 3 ? 'High' : variance <= 7 ? 'Medium' : 'Low');
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, router]);

  // Generate cycle trend data (last 6 months)
  const cycleTrendData = [
    { month: 'JUL', value: 28 },
    { month: 'AUG', value: 29 },
    { month: 'SEP', value: 27 },
    { month: 'OCT', value: 28 },
    { month: 'NOV', value: 30 },
    { month: 'DEC', value: 28 }
  ];

  // Generate mood vs cycle data (28 days)
  const moodData = Array.from({ length: 28 }, (_, i) => {
    const day = i + 1;
    let intensity = 0;
    if (day <= 5) intensity = 3; // Period - high intensity
    else if (day >= 12 && day <= 16) intensity = 1; // Ovulation - low intensity
    else if (day >= 22) intensity = 2; // PMS - medium intensity
    else intensity = 0.5; // Normal
    return intensity;
  });

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
            Loading insights...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 relative overflow-hidden">
      <FloatingLeaves />
      <PeriodTrackerHeader userName={userName} />

      <main className={`max-w-7xl mx-auto px-6 py-8 relative z-10 ${!hasLoggedCycle ? 'filter blur-sm pointer-events-none' : ''}`}>
        {/* AI Pulse Analysis Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-3xl p-8 mb-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-semibold uppercase tracking-wide">AI PULSE ANALYSIS</span>
              </div>
              <h1 className="text-3xl font-bold mb-3">Your cycle is consistent</h1>
              <p className="text-purple-100 leading-relaxed">
                Based on your last 6 months of data, your body is keeping a predictable pattern. Your next fertile window starts in 4 days.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-48 h-48 bg-gradient-to-br from-green-400 to-teal-500 rounded-3xl shadow-2xl flex items-center justify-center">
                <div className="text-6xl">🌸</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Cycle Length */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Cycle length</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">{cycleLength}</span>
                  <span className="text-sm text-gray-600">days</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-teal-600">—</span>
              <span className="text-gray-600">No change</span>
            </div>
          </div>

          {/* Period Length */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Period length</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">{periodLength}</span>
                  <span className="text-sm text-gray-600">days</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-red-600">-1d</span>
              <span className="text-gray-600">vs last</span>
            </div>
          </div>

          {/* Regularity */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Regularity</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">{regularity}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-semibold">
                Optimal
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cycle Trend Chart - Full Component */}
            <CycleTrendChart cycles={cycles} />

            {/* Mood vs Cycle */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Mood vs Cycle</h3>
              
              <div className="grid grid-cols-7 gap-2 mb-4">
                {moodData.map((intensity, index) => {
                  const day = index + 1;
                  const isDay1 = day === 1;
                  const isDay14 = day === 14;
                  const isDay28 = day === 28;
                  
                  return (
                    <div key={index} className="flex flex-col items-center gap-1">
                      <div
                        className={`w-full aspect-square rounded-lg transition-all ${
                          intensity === 3 ? 'bg-purple-600' :
                          intensity === 2 ? 'bg-purple-400' :
                          intensity === 1 ? 'bg-purple-200' :
                          'bg-purple-50'
                        }`}
                      ></div>
                      {(isDay1 || isDay14 || isDay28) && (
                        <span className="text-[10px] text-gray-400 font-medium">
                          {isDay1 ? 'DAY 1' : isDay14 ? 'DAY 14 (OVULATION)' : 'DAY 28'}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Symptoms Frequency */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Symptoms frequency</h3>
              
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#e5e7eb"
                      strokeWidth="24"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="url(#symptomGradient)"
                      strokeWidth="24"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 80}
                      strokeDashoffset={2 * Math.PI * 80 * (1 - 0.82)}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="symptomGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900">82%</span>
                    <span className="text-sm text-gray-500">Headache</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Cramps (45%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Bloating (30%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span className="text-sm text-gray-700">Fatigue (17%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span className="text-sm text-gray-700">Other (18%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Insights */}
          <div className="space-y-6">
            {/* Pattern Section */}
            <div className="bg-purple-50 rounded-2xl p-6 shadow-sm border border-purple-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Pattern Section</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Pain Insight</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Cramps mostly occur Day 1-2. Consider light yoga 24h prior to minimize intensity.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Sleep Pattern</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Your sleep quality tends to dip 2 days before your period begins. Magnesium might help.
                  </p>
                </div>
              </div>
            </div>

            {/* Community Hub */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Community Hub</h3>
              <p className="text-sm text-gray-600 mb-4">
                Talk to other moms about navigating cycle changes postpartum.
              </p>

              <div className="flex items-center -space-x-2 mb-4">
                <div className="w-8 h-8 bg-purple-400 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-pink-400 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-teal-400 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-blue-400 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white">
                  +12
                </div>
              </div>

              <button
                onClick={() => router.push('/community')}
                className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
              >
                Join Discussion
              </button>
            </div>

            {/* Upgrade to Pro */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 shadow-sm border border-pink-200">
              <p className="text-xs text-purple-600 font-bold uppercase tracking-wide mb-2">
                UPGRADE TO PRO
              </p>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Get personalized hormone tracking recommendations
              </h3>
              <button className="text-purple-600 font-semibold text-sm hover:underline flex items-center gap-1">
                Learn more →
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Blur Overlay - Show when no cycle logged */}
      {!hasLoggedCycle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md mx-4 p-8 text-center"
          >
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Log Your First Cycle</h2>
            <p className="text-gray-600 mb-6">
              To access insights and analytics, please log your first menstrual cycle in the configuration section.
            </p>
            <button
              onClick={() => router.push('/dashboard/period/my-cycle')}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Go to Cycle Configuration
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
