'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserCycles, getPeriodPrediction } from '@/lib/firestore';

export default function CycleProgressCard() {
  const { user } = useAuth();
  const [currentDay, setCurrentDay] = useState(12);
  const [cyclePhase, setCyclePhase] = useState('Follicular');
  const [phaseDescription, setPhaseDescription] = useState('Your body is prepping for total main character energy.');
  const [phaseDetails, setPhaseDetails] = useState('Natural energy is rising, and your skin is likely looking its best! It\'s the perfect time to crush school projects or hang out with friends.');
  const [nextPeriod, setNextPeriod] = useState(16);
  const [glowLevel, setGlowLevel] = useState('High');
  const [loading, setLoading] = useState(true);
  const [usingMLPrediction, setUsingMLPrediction] = useState(false);

  useEffect(() => {
    const loadCycleData = async () => {
      if (!user) return;

      try {
        const cycles = await getUserCycles(user.uid);
        
        if (cycles.length > 0) {
          // Get the most recent cycle
          const latestCycle = cycles[cycles.length - 1];
          const startDate = new Date(latestCycle.start_date);
          const today = new Date();
          
          // Calculate current day of cycle
          const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          
          // Try to get ML prediction
          const prediction = await getPeriodPrediction(user.uid);
          
          let cycleDay = daysSinceStart;
          let daysUntilPeriod = 16;
          
          if (prediction && prediction.nextPeriodDate) {
            // Use ML prediction
            const nextPeriodDate = new Date(prediction.nextPeriodDate);
            daysUntilPeriod = Math.floor((nextPeriodDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            
            // Calculate cycle day based on predicted cycle length
            cycleDay = daysSinceStart % prediction.predictedCycleLength || 1;
            setUsingMLPrediction(true);
          } else {
            // Fallback to simple calculation
            cycleDay = daysSinceStart % 28 || 1;
            daysUntilPeriod = 28 - cycleDay;
          }
          
          setCurrentDay(cycleDay);
          setNextPeriod(daysUntilPeriod > 0 ? daysUntilPeriod : 0);

          // Determine phase based on cycle day
          let phase = '';
          let description = '';
          let details = '';
          let glow = '';
          
          if (cycleDay >= 1 && cycleDay <= 5) {
            phase = 'Menstrual';
            description = 'Your body is resetting and renewing.';
            details = 'Take it easy, rest when you need to, and be gentle with yourself. This is your body\'s natural reset phase.';
            glow = 'Low';
          } else if (cycleDay >= 6 && cycleDay <= 13) {
            phase = 'Follicular';
            description = 'Your body is prepping for total main character energy.';
            details = 'Natural energy is rising, and your skin is likely looking its best! It\'s the perfect time to crush school projects or hang out with friends.';
            glow = 'High';
          } else if (cycleDay >= 14 && cycleDay <= 16) {
            phase = 'Ovulation';
            description = 'Peak energy and confidence time!';
            details = 'You\'re at your most social and energetic. Great time for presentations, social events, and trying new things.';
            glow = 'Peak';
          } else {
            phase = 'Luteal';
            description = 'Your body is winding down and preparing.';
            details = 'Energy may dip, and you might crave comfort. Listen to your body and prioritize self-care and rest.';
            glow = 'Medium';
          }

          setCyclePhase(phase);
          setPhaseDescription(description);
          setPhaseDetails(details);
          setGlowLevel(glow);
        }
      } catch (error) {
        console.error('Error loading cycle data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCycleData();
  }, [user]);

  const progress = (currentDay / 28) * 100;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 shadow-sm">
      {usingMLPrediction && (
        <div className="mb-4 px-3 py-2 bg-purple-100 rounded-lg flex items-center gap-2">
          <span className="text-xs font-semibold text-purple-700">🤖 AI-Powered Prediction</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side - Circular Progress */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-64 h-64">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="90"
                stroke="#e5e7eb"
                strokeWidth="20"
                fill="none"
              />
              {/* Progress Circle */}
              <circle
                cx="128"
                cy="128"
                r="90"
                stroke="url(#gradient)"
                strokeWidth="20"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm text-gray-500 uppercase tracking-wide">DAY</span>
              <span className="text-6xl font-bold text-purple-600">{currentDay}</span>
            </div>
          </div>

          {/* Phase Badge */}
          <div className="mt-6 px-4 py-2 bg-gradient-to-r from-teal-100 to-teal-200 rounded-full">
            <span className="text-sm font-semibold text-teal-700">
              ✨ GLOW PHASE ({cyclePhase})
            </span>
          </div>
        </div>

        {/* Right Side - Details */}
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {phaseDescription}
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {phaseDetails}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">NEXT PERIOD</p>
              <p className="text-2xl font-bold text-gray-900">{nextPeriod} days</p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">GLOW LEVEL</p>
              <p className="text-2xl font-bold text-gray-900">{glowLevel} ✨</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
