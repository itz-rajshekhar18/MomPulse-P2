'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserProfile, getUserCycles, saveCycleData, updateUserProfile } from '@/lib/firestore';
import PeriodTrackerHeader from '@/components/dashboard/PeriodTrackerHeader';
import FloatingLeaves from '@/components/animations/FloatingLeaves';
import { motion } from 'framer-motion';
import { Settings, Bell, History, Calendar, Droplet, Smile, Sparkles, Plus, Minus } from 'lucide-react';

export default function MyCyclePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('core');
  
  // Cycle settings
  const [avgCycleLength, setAvgCycleLength] = useState(28);
  const [avgPeriodLength, setAvgPeriodLength] = useState(5);
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  
  // Tracking preferences
  const [predictOvulation, setPredictOvulation] = useState(true);
  const [trackFlowIntensity, setTrackFlowIntensity] = useState(true);
  const [moodTracking, setMoodTracking] = useState(false);
  
  // Smart reminders
  const [cycleStartWarning, setCycleStartWarning] = useState(true);
  const [dailyLogReminder, setDailyLogReminder] = useState(true);
  const [insightNotifications, setInsightNotifications] = useState(true);
  const [reminderTime, setReminderTime] = useState('8:00 PM');

  // Cycle history
  const [cycles, setCycles] = useState<any[]>([]);
  
  // Add cycle modal state
  const [showAddCycleModal, setShowAddCycleModal] = useState(false);
  const [newCycleStartDate, setNewCycleStartDate] = useState('');
  const [newCycleEndDate, setNewCycleEndDate] = useState('');
  const [newCycleFlowIntensity, setNewCycleFlowIntensity] = useState<'light' | 'medium' | 'heavy'>('medium');
  const [newCycleSymptoms, setNewCycleSymptoms] = useState<string[]>([]);
  const [newCycleNotes, setNewCycleNotes] = useState('');

  const symptomOptions = [
    'Cramps', 'Headache', 'Bloating', 'Mood Swings', 'Fatigue',
    'Back Pain', 'Breast Tenderness', 'Acne', 'Food Cravings', 'Nausea'
  ];

  const tabs = [
    { id: 'core', label: 'Core Settings', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'history', label: 'Cycle History', icon: History }
  ];

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

        // Load saved cycle settings from profile
        if (profile?.cycleSettings) {
          setAvgCycleLength(profile.cycleSettings.avgCycleLength || 28);
          setAvgPeriodLength(profile.cycleSettings.avgPeriodLength || 5);
          setLastPeriodDate(profile.cycleSettings.lastPeriodDate || '');
          setPredictOvulation(profile.cycleSettings.predictOvulation ?? true);
          setTrackFlowIntensity(profile.cycleSettings.trackFlowIntensity ?? true);
          setMoodTracking(profile.cycleSettings.moodTracking ?? false);
          setCycleStartWarning(profile.cycleSettings.cycleStartWarning ?? true);
          setDailyLogReminder(profile.cycleSettings.dailyLogReminder ?? true);
          setInsightNotifications(profile.cycleSettings.insightNotifications ?? true);
          setReminderTime(profile.cycleSettings.reminderTime || '8:00 PM');
        }

        const userCycles = await getUserCycles(user.uid);
        setCycles(userCycles);
        
        // Calculate average cycle length from actual data
        if (userCycles.length > 1) {
          let totalCycleLength = 0;
          for (let i = 1; i < userCycles.length; i++) {
            const prevStart = new Date(userCycles[i - 1].start_date);
            const currentStart = new Date(userCycles[i].start_date);
            const diff = Math.floor((currentStart.getTime() - prevStart.getTime()) / (1000 * 60 * 60 * 24));
            totalCycleLength += diff;
          }
          const calculatedAvgCycleLength = Math.round(totalCycleLength / (userCycles.length - 1));
          setAvgCycleLength(calculatedAvgCycleLength);
        }

        // Calculate average period length from actual data
        if (userCycles.length > 0) {
          const totalPeriodLength = userCycles.reduce((sum, cycle) => {
            const start = new Date(cycle.start_date);
            const end = new Date(cycle.end_date);
            return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
          }, 0);
          const calculatedAvgPeriodLength = Math.round(totalPeriodLength / userCycles.length);
          setAvgPeriodLength(calculatedAvgPeriodLength);

          // Set last period date from most recent cycle
          const latestCycle = userCycles[userCycles.length - 1];
          setLastPeriodDate(latestCycle.start_date);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, router]);

  const handleSaveSettings = async () => {
    if (!user) return;

    try {
      // Save cycle configuration to user profile
      await updateUserProfile(user.uid, {
        cycleSettings: {
          avgCycleLength,
          avgPeriodLength,
          lastPeriodDate,
          predictOvulation,
          trackFlowIntensity,
          moodTracking,
          cycleStartWarning,
          dailyLogReminder,
          insightNotifications,
          reminderTime
        }
      });

      alert('✅ Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
  };

  const handleAddCycle = async () => {
    if (!user || !newCycleStartDate || !newCycleEndDate) {
      alert('Please fill in start and end dates');
      return;
    }

    // Validate dates
    const startDate = new Date(newCycleStartDate);
    const endDate = new Date(newCycleEndDate);
    
    if (endDate < startDate) {
      alert('End date must be after start date');
      return;
    }

    try {
      // Save cycle to Firestore
      await saveCycleData(user.uid, {
        start_date: newCycleStartDate,
        end_date: newCycleEndDate,
        symptoms: newCycleSymptoms,
        flow_intensity: newCycleFlowIntensity,
        notes: newCycleNotes
      });

      // Reload cycles
      const userCycles = await getUserCycles(user.uid);
      setCycles(userCycles);

      // Reset form
      setNewCycleStartDate('');
      setNewCycleEndDate('');
      setNewCycleSymptoms([]);
      setNewCycleFlowIntensity('medium');
      setNewCycleNotes('');
      setShowAddCycleModal(false);

      alert('✅ Cycle logged successfully!');
    } catch (error) {
      console.error('Error saving cycle:', error);
      alert('Failed to save cycle');
    }
  };

  const toggleSymptom = (symptom: string) => {
    if (newCycleSymptoms.includes(symptom)) {
      setNewCycleSymptoms(newCycleSymptoms.filter(s => s !== symptom));
    } else {
      setNewCycleSymptoms([...newCycleSymptoms, symptom]);
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
            Loading settings...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 relative overflow-hidden">
      <FloatingLeaves />
      <PeriodTrackerHeader userName={userName} />

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 sticky top-24">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3 px-2">
                CYCLE SETTINGS
              </p>
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        activeTab === tab.id
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium text-sm">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'core' && (
              <div className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Cycle Configuration</h1>
                  <p className="text-gray-600">
                    Customize your tracking experience to receive highly personalized wellness insights and accurate predictions.
                  </p>
                </div>

                {/* Quick Log Cycle Card - MOVED TO TOP */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-sm border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Log Your Cycle</h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          Track your menstrual cycle to get AI-powered predictions and personalized insights.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAddCycleModal(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all whitespace-nowrap"
                    >
                      <Plus className="w-5 h-5" />
                      Log Cycle
                    </button>
                  </div>
                </div>

                {/* Cycle Length Settings */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Average Cycle Length */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <label className="text-sm font-semibold text-gray-900">Average Cycle Length</label>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setAvgCycleLength(Math.max(21, avgCycleLength - 1))}
                          className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-5 h-5 text-gray-700" />
                        </button>
                        <div className="flex-1 bg-gray-50 rounded-xl px-6 py-4 text-center">
                          <span className="text-3xl font-bold text-gray-900">{avgCycleLength}</span>
                        </div>
                        <button
                          onClick={() => setAvgCycleLength(Math.min(45, avgCycleLength + 1))}
                          className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-5 h-5 text-gray-700" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Typically 21-35 days.</p>
                    </div>

                    {/* Average Period Length */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Droplet className="w-5 h-5 text-pink-600" />
                        <label className="text-sm font-semibold text-gray-900">Average Period Length</label>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setAvgPeriodLength(Math.max(2, avgPeriodLength - 1))}
                          className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-5 h-5 text-gray-700" />
                        </button>
                        <div className="flex-1 bg-gray-50 rounded-xl px-6 py-4 text-center">
                          <span className="text-3xl font-bold text-gray-900">{avgPeriodLength}</span>
                        </div>
                        <button
                          onClick={() => setAvgPeriodLength(Math.min(10, avgPeriodLength + 1))}
                          className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-5 h-5 text-gray-700" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Typically 3-7 days.</p>
                    </div>
                  </div>

                  {/* Last Period Start Date */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <label className="text-sm font-semibold text-gray-900">Last Period Start Date</label>
                    </div>
                    <div className="relative">
                      <input
                        type="date"
                        value={lastPeriodDate}
                        onChange={(e) => setLastPeriodDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Enter the date your last bleeding started.</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => router.back()}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveSettings}
                      className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                    >
                      Save Settings
                    </button>
                  </div>
                </div>

                {/* Tracking Preferences */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Settings className="w-5 h-5 text-purple-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Tracking Preferences</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-900 font-medium">Predict Ovulation</span>
                      </div>
                      <button
                        onClick={() => setPredictOvulation(!predictOvulation)}
                        className={`w-14 h-8 rounded-full transition-colors relative ${
                          predictOvulation ? 'bg-purple-600' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                            predictOvulation ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        ></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-900 font-medium">Track Flow Intensity</span>
                      </div>
                      <button
                        onClick={() => setTrackFlowIntensity(!trackFlowIntensity)}
                        className={`w-14 h-8 rounded-full transition-colors relative ${
                          trackFlowIntensity ? 'bg-purple-600' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                            trackFlowIntensity ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        ></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-900 font-medium">Mood Tracking</span>
                      </div>
                      <button
                        onClick={() => setMoodTracking(!moodTracking)}
                        className={`w-14 h-8 rounded-full transition-colors relative ${
                          moodTracking ? 'bg-purple-600' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                            moodTracking ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        ></div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Smart Reminders */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                      <Bell className="w-5 h-5 text-teal-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Smart Reminders</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-gray-900 font-medium">Cycle Start Warning</p>
                        <p className="text-sm text-gray-500">2 DAYS BEFORE</p>
                      </div>
                      <button
                        onClick={() => setCycleStartWarning(!cycleStartWarning)}
                        className={`w-14 h-8 rounded-full transition-colors relative ${
                          cycleStartWarning ? 'bg-purple-600' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                            cycleStartWarning ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        ></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-gray-900 font-medium">Daily Log Reminder</p>
                        <p className="text-sm text-gray-500">{reminderTime}</p>
                      </div>
                      <button
                        onClick={() => setDailyLogReminder(!dailyLogReminder)}
                        className={`w-14 h-8 rounded-full transition-colors relative ${
                          dailyLogReminder ? 'bg-purple-600' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                            dailyLogReminder ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        ></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-gray-900 font-medium">Insight Notifications</p>
                      </div>
                      <button
                        onClick={() => setInsightNotifications(!insightNotifications)}
                        className={`w-14 h-8 rounded-full transition-colors relative ${
                          insightNotifications ? 'bg-purple-600' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                            insightNotifications ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        ></div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pro Tip */}
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 shadow-sm border border-teal-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Pro Tip: Regularity Matters</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Tracking your period for at least 3 consecutive months helps MomPulse provide highly accurate ovulation and fertility windows. Stay consistent for the best health insights!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Notification Settings</h2>
                  <p className="text-gray-600 mb-6">Customize how and when you receive notifications from MomPulse.</p>
                  
                  <div className="space-y-6">
                    {/* Push Notifications */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Push Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2">
                          <span className="text-gray-700">Period Reminders</span>
                          <button className="w-14 h-8 rounded-full bg-purple-600 transition-colors relative">
                            <div className="absolute top-1 w-6 h-6 bg-white rounded-full translate-x-7"></div>
                          </button>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-gray-700">Ovulation Alerts</span>
                          <button className="w-14 h-8 rounded-full bg-purple-600 transition-colors relative">
                            <div className="absolute top-1 w-6 h-6 bg-white rounded-full translate-x-7"></div>
                          </button>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-gray-700">Community Updates</span>
                          <button className="w-14 h-8 rounded-full bg-gray-300 transition-colors relative">
                            <div className="absolute top-1 w-6 h-6 bg-white rounded-full translate-x-1"></div>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Quiet Hours */}
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiet Hours</h3>
                      <p className="text-sm text-gray-600 mb-4">Set times when you don't want to receive notifications</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                          <input
                            type="time"
                            defaultValue="22:00"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                          <input
                            type="time"
                            defaultValue="08:00"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Cycle History</h2>
                      <p className="text-gray-600">View and manage your logged menstrual cycles.</p>
                    </div>
                    <button
                      onClick={() => setShowAddCycleModal(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      Log New Cycle
                    </button>
                  </div>
                  
                  {cycles.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No cycles logged yet</h3>
                      <p className="text-gray-600 mb-6">Start tracking your cycle to see your history here</p>
                      <button
                        onClick={() => setShowAddCycleModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                      >
                        Log Your First Cycle
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cycles.map((cycle, index) => {
                        const startDate = new Date(cycle.start_date);
                        const endDate = new Date(cycle.end_date);
                        const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                        
                        return (
                          <motion.div
                            key={cycle.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-purple-300 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="p-2 bg-purple-100 rounded-lg">
                                    <Calendar className="w-5 h-5 text-purple-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Cycle {cycles.length - index}</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                      {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">Duration</p>
                                    <p className="text-sm font-medium text-gray-900">{duration} days</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">Flow</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                      cycle.flow_intensity === 'light' ? 'bg-green-100 text-green-700' :
                                      cycle.flow_intensity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-red-100 text-red-700'
                                    }`}>
                                      {cycle.flow_intensity}
                                    </span>
                                  </div>
                                  <div className="col-span-2">
                                    <p className="text-xs text-gray-500 mb-1">Symptoms</p>
                                    {cycle.symptoms && cycle.symptoms.length > 0 ? (
                                      <div className="flex flex-wrap gap-1">
                                        {cycle.symptoms.slice(0, 2).map((symptom: string, i: number) => (
                                          <span key={i} className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs">
                                            {symptom}
                                          </span>
                                        ))}
                                        {cycle.symptoms.length > 2 && (
                                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                                            +{cycle.symptoms.length - 2}
                                          </span>
                                        )}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-gray-400">None logged</p>
                                    )}
                                  </div>
                                </div>

                                {cycle.notes && (
                                  <div className="mt-3 pt-3 border-t border-gray-200">
                                    <p className="text-xs text-gray-500 mb-1">Notes</p>
                                    <p className="text-sm text-gray-700">{cycle.notes}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Statistics */}
                {cycles.length > 0 && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-sm border border-purple-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Your Statistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white rounded-xl p-6">
                        <p className="text-sm text-gray-600 mb-2">Total Cycles Logged</p>
                        <p className="text-3xl font-bold text-purple-600">{cycles.length}</p>
                      </div>
                      <div className="bg-white rounded-xl p-6">
                        <p className="text-sm text-gray-600 mb-2">Average Cycle Length</p>
                        <p className="text-3xl font-bold text-purple-600">{avgCycleLength} days</p>
                      </div>
                      <div className="bg-white rounded-xl p-6">
                        <p className="text-sm text-gray-600 mb-2">Average Period Length</p>
                        <p className="text-3xl font-bold text-purple-600">{avgPeriodLength} days</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Cycle Modal */}
      {showAddCycleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
              <h2 className="text-2xl font-bold text-gray-900">Log New Cycle</h2>
              <button
                onClick={() => setShowAddCycleModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newCycleStartDate}
                    onChange={(e) => setNewCycleStartDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newCycleEndDate}
                    onChange={(e) => setNewCycleEndDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    min={newCycleStartDate}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Flow Intensity */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Flow Intensity
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['light', 'medium', 'heavy'] as const).map((intensity) => (
                    <button
                      key={intensity}
                      onClick={() => setNewCycleFlowIntensity(intensity)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        newCycleFlowIntensity === intensity
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">
                        {intensity === 'light' ? '💧' : intensity === 'medium' ? '💧💧' : '💧💧💧'}
                      </div>
                      <div className="font-semibold text-gray-900 capitalize">{intensity}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Symptoms (Optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {symptomOptions.map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => toggleSymptom(symptom)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        newCycleSymptoms.includes(symptom)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={newCycleNotes}
                  onChange={(e) => setNewCycleNotes(e.target.value)}
                  rows={4}
                  placeholder="Add any additional notes about this cycle..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={() => setShowAddCycleModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCycle}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Save Cycle
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
