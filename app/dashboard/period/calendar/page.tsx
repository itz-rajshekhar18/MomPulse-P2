'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserProfile, getUserCycles, saveCycleData, getPeriodPrediction } from '@/lib/firestore';
import PeriodTrackerHeader from '@/components/dashboard/PeriodTrackerHeader';
import FloatingLeaves from '@/components/animations/FloatingLeaves';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Edit2, Lightbulb } from 'lucide-react';

interface DayData {
  date: Date;
  isPeriod: boolean;
  isOvulation: boolean;
  isPrediction: boolean;
  symptoms: string[];
  mood?: string;
  flow?: 'light' | 'medium' | 'heavy';
}

export default function CalendarPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [cycles, setCycles] = useState<any[]>([]);
  const [calendarData, setCalendarData] = useState<Map<string, DayData>>(new Map());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [cycleDay, setCycleDay] = useState(16);
  const [daysLeft, setDaysLeft] = useState(12);
  const [hasLoggedCycle, setHasLoggedCycle] = useState(false);
  
  // ML Prediction state
  const [nextPeriodDate, setNextPeriodDate] = useState<string>('');
  const [nextOvulationDate, setNextOvulationDate] = useState<string>('');
  const [daysUntilPeriod, setDaysUntilPeriod] = useState<number>(0);
  const [daysUntilOvulation, setDaysUntilOvulation] = useState<number>(0);
  
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

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

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

        const dataMap = new Map<string, DayData>();

        userCycles.forEach(cycle => {
          const startDate = new Date(cycle.start_date);
          const endDate = new Date(cycle.end_date);

          for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const key = d.toISOString().split('T')[0];
            dataMap.set(key, {
              date: new Date(d),
              isPeriod: true,
              isOvulation: false,
              isPrediction: false,
              symptoms: cycle.symptoms || [],
              flow: cycle.flow_intensity
            });
          }

          const ovulationDate = new Date(startDate);
          ovulationDate.setDate(ovulationDate.getDate() + 14);
          const ovKey = ovulationDate.toISOString().split('T')[0];
          const existing = dataMap.get(ovKey) || {
            date: ovulationDate,
            isPeriod: false,
            isOvulation: true,
            isPrediction: false,
            symptoms: []
          };
          dataMap.set(ovKey, { ...existing, isOvulation: true });

          const nextPeriodDate = new Date(startDate);
          nextPeriodDate.setDate(nextPeriodDate.getDate() + 28);
          
          if (nextPeriodDate > new Date()) {
            for (let i = 0; i < 5; i++) {
              const predDate = new Date(nextPeriodDate);
              predDate.setDate(predDate.getDate() + i);
              const predKey = predDate.toISOString().split('T')[0];
              dataMap.set(predKey, {
                date: predDate,
                isPeriod: false,
                isOvulation: false,
                isPrediction: true,
                symptoms: []
              });
            }
          }
        });

        setCalendarData(dataMap);

        // Fetch ML prediction
        try {
          const prediction = await getPeriodPrediction(user.uid);
          if (prediction) {
            setNextPeriodDate(prediction.nextPeriodDate);
            setNextOvulationDate(prediction.nextOvulationDate);
            
            // Calculate days until
            const today = new Date();
            const periodDate = new Date(prediction.nextPeriodDate);
            const ovulationDate = new Date(prediction.nextOvulationDate);
            
            const daysUntilPeriodCalc = Math.ceil((periodDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            const daysUntilOvulationCalc = Math.ceil((ovulationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            
            setDaysUntilPeriod(daysUntilPeriodCalc);
            setDaysUntilOvulation(daysUntilOvulationCalc);
          }
        } catch (error) {
          console.error('Error loading prediction:', error);
        }

        if (userCycles.length > 0) {
          const latestCycle = userCycles[userCycles.length - 1];
          const startDate = new Date(latestCycle.start_date);
          const today = new Date();
          const daysSince = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          const currentCycleDay = (daysSince % 28) + 1;
          setCycleDay(currentCycleDay);
          setDaysLeft(28 - currentCycleDay);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, router, currentMonth]);

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    const adjustedStart = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    for (let i = 0; i < adjustedStart; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
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

      // Reload cycles and calendar data
      const userCycles = await getUserCycles(user.uid);
      setCycles(userCycles);
      setHasLoggedCycle(userCycles.length > 0);

      // Reset form
      setNewCycleStartDate('');
      setNewCycleEndDate('');
      setNewCycleSymptoms([]);
      setNewCycleFlowIntensity('medium');
      setNewCycleNotes('');
      setShowAddCycleModal(false);

      alert('✅ Cycle logged successfully!');
      
      // Reload page to update calendar
      window.location.reload();
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

  const getDayData = (day: number | null): DayData | null => {
    if (!day) return null;
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      .toISOString().split('T')[0];
    return calendarData.get(dateStr) || null;
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return day === today.getDate() &&
           currentMonth.getMonth() === today.getMonth() &&
           currentMonth.getFullYear() === today.getFullYear();
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
            Loading calendar...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  const days = getDaysInMonth();
  const selectedDayData = getDayData(selectedDate.getDate());

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 relative overflow-hidden">
      <FloatingLeaves />
      <PeriodTrackerHeader userName={userName} />

      <main className={`max-w-7xl mx-auto px-6 py-8 relative z-10 ${!hasLoggedCycle ? 'filter blur-sm pointer-events-none' : ''}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar - Left Side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
              {/* Month Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevMonth}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setShowAddCycleModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium hover:shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Log Cycle
                </button>
                <button
                  onClick={() => setShowAddCycleModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Mark Period
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-700 rounded-full font-medium hover:bg-pink-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Symptom
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Day Headers */}
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, index) => (
                  <div key={index} className="text-center text-xs font-bold text-gray-500 py-2">
                    {day}
                  </div>
                ))}

                {/* Calendar Days */}
                {days.map((day, index) => {
                  const dayData = getDayData(day);
                  const today = isToday(day);

                  return (
                    <div
                      key={index}
                      onClick={() => day && setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
                      className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all cursor-pointer relative p-2
                        ${!day ? 'invisible' : ''}
                        ${today ? 'ring-2 ring-purple-600 bg-purple-50' : ''}
                        ${dayData?.isPeriod ? 'bg-pink-100' : ''}
                        ${dayData?.isOvulation ? 'bg-yellow-100' : ''}
                        ${dayData?.isPrediction ? 'bg-purple-50 border-2 border-purple-300 border-dashed' : ''}
                        ${!today && !dayData ? 'hover:bg-gray-50' : ''}
                      `}
                    >
                      {day && (
                        <>
                          <span className={`text-base font-medium ${today ? 'text-purple-700' : 'text-gray-900'}`}>
                            {day}
                          </span>
                          
                          {/* Indicators */}
                          <div className="flex items-center gap-1 mt-1">
                            {dayData?.isPeriod && (
                              <div className="flex gap-0.5">
                                {dayData.flow === 'heavy' && <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>}
                                {(dayData.flow === 'heavy' || dayData.flow === 'medium') && <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>}
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                              </div>
                            )}
                            {dayData?.symptoms && dayData.symptoms.length > 0 && (
                              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                            )}
                          </div>

                          {/* Ovulation Star */}
                          {dayData?.isOvulation && (
                            <div className="absolute top-1 right-1 text-yellow-500 text-xs">⭐</div>
                          )}

                          {/* Today Badge */}
                          {today && (
                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                              <span className="text-[8px] bg-purple-600 text-white px-1.5 py-0.5 rounded-full font-bold">
                                TODAY
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Predictions */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      📅
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">NEXT PERIOD</p>
                      <p className="text-sm font-bold text-gray-900">
                        {nextPeriodDate 
                          ? new Date(nextPeriodDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                          : 'Log cycles to predict'}
                      </p>
                    </div>
                  </div>
                  {daysUntilPeriod > 0 && (
                    <p className="text-xs text-gray-600">In {daysUntilPeriod} days</p>
                  )}
                </div>

                <div className="bg-yellow-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      ⭐
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">NEXT OVULATION</p>
                      <p className="text-sm font-bold text-gray-900">
                        {nextOvulationDate 
                          ? new Date(nextOvulationDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                          : 'Log cycles to predict'}
                      </p>
                    </div>
                  </div>
                  {daysUntilOvulation > 0 && (
                    <p className="text-xs text-gray-600">In {daysUntilOvulation} days</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Cycle Day Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                TODAY, {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }).toUpperCase()}
              </p>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Cycle Day {cycleDay}</h3>
              
              {/* Circular Progress */}
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 56}
                    strokeDashoffset={2 * Math.PI * 56 * (1 - cycleDay / 28)}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">{daysLeft}</span>
                  <span className="text-xs text-gray-500">DAYS LEFT</span>
                </div>
              </div>
            </div>

            {/* Symptoms */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Symptoms</h3>
                <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedDayData?.symptoms && selectedDayData.symptoms.length > 0 ? (
                  selectedDayData.symptoms.map((symptom, i) => (
                    <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      • {symptom}
                    </span>
                  ))
                ) : (
                  <>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      • Cramps
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      • Bloating
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Mood */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Mood</h3>
                <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-yellow-50 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">😊</div>
                  <p className="text-xs font-semibold text-gray-700">HAPPY</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">😴</div>
                  <p className="text-xs font-semibold text-gray-700">TIRED</p>
                </div>
              </div>
            </div>

            {/* Wellness Tip */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 shadow-sm border border-teal-200">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-teal-600" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Wellness Tip</h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                You're in your luteal phase. Magnesium-rich foods like dark chocolate or spinach can help with those mild cramps.
              </p>
            </div>
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

      {/* Blur Overlay - Show when no cycle logged */}
      {!hasLoggedCycle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md mx-4 p-8 text-center"
          >
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Log Your First Cycle</h2>
            <p className="text-gray-600 mb-6">
              To access the calendar and start tracking, please log your first menstrual cycle in the configuration section.
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
