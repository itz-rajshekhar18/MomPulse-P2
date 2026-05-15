'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { 
  getUserProfile, 
  getPregnancyInfo, 
  getLatestPregnancyLog,
  savePregnancyLog 
} from '@/lib/firestore';
import { usePregnancyWellness } from '@/lib/usePregnancyWellness';
import PregnancyHeader from '@/components/pregnancy/PregnancyHeader';
import WeekProgressCard from '@/components/pregnancy/WeekProgressCard';
import BabyGrowthInfoCard from '@/components/pregnancy/BabyGrowthInfoCard';
import SanctuaryInsightCard from '@/components/pregnancy/SanctuaryInsightCard';
import DailyRitualsCard from '@/components/pregnancy/DailyRitualsCard';
import SymptomsCard from '@/components/pregnancy/SymptomsCard';
import DailyMoodCard from '@/components/pregnancy/DailyMoodCard';
import FloatingLeaves from '@/components/animations/FloatingLeaves';
import { motion } from 'framer-motion';

export default function PregnancyTrackerPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [pregnancyInfo, setPregnancyInfo] = useState<any>(null);
  const [latestLog, setLatestLog] = useState<any>(null);
  
  // Tracking state
  const [waterIntake, setWaterIntake] = useState(1.4);
  const [sleepHours, setSleepHours] = useState(7.2);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [symptoms, setSymptoms] = useState<any[]>([]);
  const [energyLevel, setEnergyLevel] = useState(7);
  const [dietAdherence, setDietAdherence] = useState(75);

  const { predict, prediction, loading: predicting } = usePregnancyWellness();

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

      // Load latest log
      let log = null;
      log = await getLatestPregnancyLog(user.uid);
      if (log) {
        setLatestLog(log);
        setWaterIntake(log.water_pct / 100 * 2); // Convert percentage to liters
        setSleepHours(log.sleep);
        setEnergyLevel(log.energy);
        setDietAdherence(log.diet_pct);
        setSymptoms(log.symptoms?.map((s: string, i: number) => ({
          id: `${i}`,
          name: s,
          description: '',
          icon: 'back'
        })) || []);
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
                symptoms: log?.symptoms
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

  const handleSaveLog = async () => {
    if (!user || !pregnancyInfo) {
      alert('Please complete your pregnancy information first');
      return;
    }

    try {
      const currentWeek = pregnancyInfo.currentWeek || 24;
      const trimester = Math.ceil(currentWeek / 13.33);

      // Get ML prediction
      const mlPrediction = await predict({
        week: currentWeek,
        energy: energyLevel,
        sleep: sleepHours,
        symptom_count: symptoms.length,
        water_pct: Math.round((waterIntake / 2) * 100), // Convert liters to percentage
        diet_pct: dietAdherence,
      });

      if (!mlPrediction) {
        alert('Failed to get wellness prediction');
        return;
      }

      // Save to Firestore
      await savePregnancyLog(user.uid, {
        week: currentWeek,
        energy: energyLevel,
        sleep: sleepHours,
        symptom_count: symptoms.length,
        symptoms: symptoms.map(s => s.name),
        water_pct: Math.round((waterIntake / 2) * 100),
        diet_pct: dietAdherence,
        trimester,
        wellness_score: mlPrediction.wellness_score,
        risk_level: mlPrediction.risk_level,
        risk_class: mlPrediction.risk_class,
        notes: `Mood: ${selectedMood}`,
      });

      alert('Daily log saved successfully!');
      
      // Reload latest log
      const log = await getLatestPregnancyLog(user.uid);
      setLatestLog(log);
    } catch (error) {
      console.error('Error saving log:', error);
      alert('Failed to save log');
    }
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tracker...</p>
        </div>
      </div>
    );
  }

  const currentWeek = pregnancyInfo?.currentWeek || 24;
  const trimester = Math.ceil(currentWeek / 13.33);
  const dueDate = pregnancyInfo?.dueDate || 'Oct 15';

  const getBabyComparison = (week: number): string => {
    if (week <= 12) return 'Lime';
    if (week <= 16) return 'Avocado';
    if (week <= 20) return 'Banana';
    if (week <= 24) return 'Eggplant';
    if (week <= 28) return 'Cauliflower';
    if (week <= 32) return 'Pineapple';
    if (week <= 36) return 'Honeydew';
    return 'Watermelon';
  };

  const getBabyDescription = (week: number): string => {
    if (week === 24) {
      return "Your little one is getting stronger every day. Hearing is fully developed, meaning they can now recognize the melody of your voice and even respond to loud noises from the outside world.";
    }
    return "Your baby is growing and developing beautifully. Keep up the great work!";
  };

  const defaultSymptoms = [
    {
      id: '1',
      name: 'Mild backaches',
      description: "Common as your center of gravity shifts. Try a pillow between your knees.",
      icon: 'back',
      severity: 'mild' as const
    },
    {
      id: '2',
      name: 'Increased energy',
      description: 'Enjoy this "golden period" of the second trimester.',
      icon: 'energy',
      severity: 'mild' as const
    },
    {
      id: '3',
      name: 'Vivid Dreams',
      description: 'Hormonal changes may cause more intense dreaming phases.',
      icon: 'dreams',
      severity: 'mild' as const
    }
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
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pregnancy Tracker 🤰
          </h1>
          <p className="text-gray-600">
            Track your daily wellness and get ML-powered insights
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Week Progress */}
            <WeekProgressCard
              currentWeek={currentWeek}
              trimester={trimester}
              dueDate={dueDate}
            />

            {/* Baby Growth Info */}
            <BabyGrowthInfoCard
              week={currentWeek}
              comparison={getBabyComparison(currentWeek)}
              description={getBabyDescription(currentWeek)}
            />

            {/* Daily Rituals */}
            <DailyRitualsCard
              waterIntake={waterIntake}
              waterGoal={2}
              sleepHours={sleepHours}
              sleepGoal={8}
              onUpdateWater={() => {
                const newValue = Math.min(waterIntake + 0.2, 3);
                setWaterIntake(Math.round(newValue * 10) / 10);
              }}
              onUpdateSleep={() => {
                const newValue = Math.min(sleepHours + 0.5, 12);
                setSleepHours(Math.round(newValue * 10) / 10);
              }}
            />

            {/* Symptoms */}
            <SymptomsCard
              symptoms={symptoms.length > 0 ? symptoms : defaultSymptoms}
              onAddSymptom={() => {
                alert('Symptom logging coming soon!');
              }}
              updatedTime="2h ago"
            />

            {/* Daily Mood */}
            <DailyMoodCard
              selectedMood={selectedMood}
              onMoodSelect={setSelectedMood}
            />
          </div>

          {/* Right Column - 1/3 */}
          <div className="space-y-6">
            {/* Sanctuary Insight */}
            <SanctuaryInsightCard
              insight={aiInsight?.message || "Try a 5-minute prenatal stretch today for better sleep."}
              onStartSession={() => router.push('/sanctuary')}
              isLoading={loadingInsight}
            />

            {/* Wellness Summary */}
            {prediction && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  ML Wellness Prediction
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Wellness Score</span>
                      <span className="text-3xl font-bold text-purple-600">
                        {prediction.wellness_score}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="h-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-500"
                        style={{ width: `${prediction.wellness_score}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 mb-3">
                      Status: <span className="text-purple-600">{prediction.risk_level}</span>
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-gray-700 uppercase">Insights</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-purple-50 rounded-lg p-2">
                          <p className="text-gray-500">Energy</p>
                          <p className="font-semibold">{prediction.insights.energy_status}</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-2">
                          <p className="text-gray-500">Sleep</p>
                          <p className="font-semibold">{prediction.insights.sleep_status}</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-2">
                          <p className="text-gray-500">Hydration</p>
                          <p className="font-semibold">{prediction.insights.hydration_status}</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-2">
                          <p className="text-gray-500">Diet</p>
                          <p className="font-semibold">{prediction.insights.diet_status}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-xs font-semibold text-gray-700 uppercase mb-2">
                        Recommendations
                      </h4>
                      <ul className="space-y-1">
                        {prediction.recommendations.slice(0, 3).map((rec, i) => (
                          <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                            <span className="text-purple-600">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Save Button */}
            <button
              onClick={handleSaveLog}
              disabled={predicting}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {predicting ? 'Analyzing...' : 'Save Today\'s Log'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
