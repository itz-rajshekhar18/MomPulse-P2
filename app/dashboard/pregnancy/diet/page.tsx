'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { getUserProfile, getPregnancyInfo, getLatestPregnancyLog } from '@/lib/firestore';
import PregnancyHeader from '@/components/pregnancy/PregnancyHeader';
import NutritionInsightCard from '@/components/pregnancy/NutritionInsightCard';
import MealPlanCard from '@/components/pregnancy/MealPlanCard';
import DailyProgressCard from '@/components/pregnancy/DailyProgressCard';
import PowerFoodsCard from '@/components/pregnancy/PowerFoodsCard';
import GentleRemindersCard from '@/components/pregnancy/GentleRemindersCard';
import FloatingLeaves from '@/components/animations/FloatingLeaves';
import { motion } from 'framer-motion';

export default function DietTrackerPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [pregnancyInfo, setPregnancyInfo] = useState<any>(null);
  const [aiInsight, setAiInsight] = useState<{ title: string; message: string; icon: string } | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  const loadUserData = useCallback(async () => {
    if (!user) return;
    try {
      const profile = await getUserProfile(user.uid);
      
      // Access control
      if (profile?.currentStage && profile.currentStage !== 'pregnancy') {
        router.push('/dashboard');
        return;
      }
      
      if (profile?.displayName) {
        setUserName(profile.displayName.split(' ')[0]);
      } else if (user.email) {
        setUserName(user.email.split('@')[0]);
      }

      // Load pregnancy info
      const pregInfo = await getPregnancyInfo(user.uid);
      setPregnancyInfo(pregInfo);

      // Load latest pregnancy log to pass context to AI
      const log = await getLatestPregnancyLog(user.uid);

      // Generate AI Insight
      if (!aiInsight && !loadingInsight) {
        setLoadingInsight(true);
        try {
          const insightRes = await fetch('/api/ai/insight', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              stage: 'Pregnancy',
              insightType: 'nutrition',
              contextData: {
                currentWeek: pregInfo?.currentWeek || 0,
                dietScore: log?.diet_pct,
                hydration: log?.water_pct,
                energy: log?.energy
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading nutrition...</p>
        </div>
      </div>
    );
  }

  const currentWeek = pregnancyInfo?.currentWeek || 24;
  const trimester = Math.ceil(currentWeek / 13.33);

  // Daily progress data
  const nutrients = [
    { name: 'Hydration', current: 1.8, goal: 2.5, unit: 'L', color: 'bg-blue-500' },
    { name: 'Protein', current: 52, goal: 75, unit: 'g', color: 'bg-green-600' },
    { name: 'Iron', current: 18, goal: 27, unit: 'mg', color: 'bg-red-400' },
    { name: 'Calcium', current: 900, goal: 1000, unit: 'mg', color: 'bg-purple-600' },
  ];

  // Meal plan data
  const meals = [
    {
      id: '1',
      type: 'BREAKFAST' as const,
      name: 'Berry Bliss Greek Yogurt',
      description: 'Probiotic rich yogurt with organic antioxidants.',
      nutrients: ['CALCIUM', 'FIBER'],
    },
    {
      id: '2',
      type: 'LUNCH' as const,
      name: 'Quinoa & Avocado Zen Bowl',
      description: 'Plant-based protein with healthy monounsaturated fats.',
      nutrients: ['FOLATE', 'PROTEIN'],
    },
  ];

  // Power foods data
  const powerFoods = [
    {
      id: '1',
      name: 'Avocados',
      benefit: 'Rich in healthy fats & folate',
      icon: '🥑',
      color: 'bg-green-100',
    },
    {
      id: '2',
      name: 'Walnuts',
      benefit: 'Omega-3 for baby\'s brain',
      icon: '🌰',
      color: 'bg-pink-100',
    },
    {
      id: '3',
      name: 'Leafy Greens',
      benefit: 'Essential Iron & Vitamin K',
      icon: '🥬',
      color: 'bg-green-100',
    },
  ];

  // Gentle reminders data
  const reminders = [
    {
      id: '1',
      title: 'High-Mercury Fish',
      description: 'Opt for salmon or tilapia instead.',
      icon: 'fish' as const,
    },
    {
      id: '2',
      title: 'Unpasteurized Cheese',
      description: 'Stick to hard, aged, or processed varieties.',
      icon: 'cheese' as const,
    },
    {
      id: '3',
      title: 'Excessive Caffeine',
      description: 'Try to stay below 200mg/day.',
      icon: 'coffee' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 relative overflow-hidden">
      <FloatingLeaves />
      <PregnancyHeader userName={userName} />

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-serif">
            Nutrition & Diet 🥗
          </h1>
          <p className="text-gray-600">
            A curated approach to nourishing your body and supporting your baby's growth with wholesome, mindful choices.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sanctuary Insight */}
            <NutritionInsightCard
              insight={aiInsight?.message || "Adding a squeeze of lemon to your spinach helps your body absorb more iron today! The Vitamin C acts as a natural catalyst for nutrient synthesis."}
              emoji={aiInsight?.icon || "🍋"}
              isLoading={loadingInsight}
            />

            {/* Daily Meal Plan */}
            <MealPlanCard
              meals={meals}
              onCustomizePlan={() => {
                alert('Meal plan customization coming soon!');
              }}
            />

            {/* Power Foods */}
            <PowerFoodsCard foods={powerFoods} />
          </div>

          {/* Right Column - 1/3 */}
          <div className="space-y-6">
            {/* Daily Progress */}
            <DailyProgressCard
              nutrients={nutrients}
              onLogEntry={() => {
                alert('Nutrition logging coming soon!');
              }}
            />

            {/* Gentle Reminders */}
            <GentleRemindersCard reminders={reminders} />

            {/* Book Specialist Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              onClick={() => router.push('/consultation')}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Book Specialist
            </motion.button>
          </div>
        </div>
      </main>
    </div>
  );
}
