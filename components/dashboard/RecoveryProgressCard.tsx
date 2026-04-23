'use client';

import { ChevronLeft, ChevronRight, CheckCircle2, Lightbulb } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getDeliveryInfo, getLatestRecoveryLog } from '@/lib/firestore';

export default function RecoveryProgressCard() {
  const { user } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(0);
  const [loading, setLoading] = useState(true);
  const [phaseTitle, setPhaseTitle] = useState('THE BEGINNING');
  const [mainTitle, setMainTitle] = useState('Your Recovery Journey');
  const [description, setDescription] = useState('Starting your healing journey with care and patience.');

  useEffect(() => {
    const loadRecoveryData = async () => {
      if (!user) return;

      try {
        const deliveryInfo = await getDeliveryInfo(user.uid);
        const latestLog = await getLatestRecoveryLog(user.uid);

        if (deliveryInfo) {
          const deliveryDate = new Date(deliveryInfo.deliveryDate);
          const today = new Date();
          const daysSince = Math.floor((today.getTime() - deliveryDate.getTime()) / (1000 * 60 * 60 * 24));
          const week = Math.floor(daysSince / 7);
          
          setCurrentWeek(week);

          // Set phase-specific content based on week
          if (week === 0) {
            setPhaseTitle('THE BEGINNING');
            setMainTitle('Welcome to Recovery');
            setDescription('The first week is about rest and healing. Your body is working hard to recover from delivery.');
          } else if (week <= 2) {
            setPhaseTitle('EARLY RECOVERY');
            setMainTitle('Rest & Restore');
            setDescription('Focus on rest, gentle movement, and letting your body heal. Listen to your body\'s signals.');
          } else if (week <= 4) {
            setPhaseTitle('BUILDING STRENGTH');
            setMainTitle('Gentle Progress');
            setDescription('Your body is adapting. Start with light activities and gentle core reconnection exercises.');
          } else if (week <= 6) {
            setPhaseTitle('THE TRANSITION PHASE');
            setMainTitle('Patience is Progress');
            setDescription('This week, your body starts to find its new equilibrium. Focus on structural support, and light core reconnection.');
          } else if (week <= 8) {
            setPhaseTitle('ACTIVE RECOVERY');
            setMainTitle('Building Momentum');
            setDescription('You\'re making great progress! Continue building strength while honoring your body\'s limits.');
          } else {
            setPhaseTitle('THRIVING');
            setMainTitle('You\'re Amazing');
            setDescription('You\'ve come so far! Keep nurturing your body and celebrating your progress.');
          }
        }
      } catch (error) {
        console.error('Error loading recovery data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecoveryData();
  }, [user]);

  const milestones = [
    {
      icon: CheckCircle2,
      title: 'Healing Milestones',
      description: 'Soft tissue recovery & hormonal stabilization',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      icon: Lightbulb,
      title: 'Gentle Tip',
      description: 'Try gentle breathing to ease ribcage tension',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-sm border border-purple-100">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-sm border border-purple-100">
      {/* Week Indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button className="p-1 hover:bg-white/50 rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-purple-600" />
          </button>
          <div className="px-4 py-1 bg-purple-100 rounded-full">
            <span className="text-sm font-medium text-purple-700">
              WEEK {currentWeek}: {phaseTitle}
            </span>
          </div>
          <button className="p-1 hover:bg-white/50 rounded-full transition-colors">
            <ChevronRight className="w-5 h-5 text-purple-600" />
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side - Text Content */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {mainTitle}
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {description}
          </p>

          {/* Milestones */}
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`p-2 ${milestone.bgColor} rounded-lg`}>
                  <milestone.icon className={`w-5 h-5 ${milestone.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{milestone.title}</h3>
                  <p className="text-sm text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Visual Card */}
        <div className="flex items-center justify-center">
          <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl p-8 w-full max-w-sm aspect-square flex items-center justify-center shadow-xl">
            <div className="text-center">
              <div className="bg-blue-400/20 backdrop-blur-sm rounded-xl p-6 border border-blue-300/30">
                <h3 className="text-3xl font-bold text-blue-200 mb-2">RECOVERY</h3>
                <div className="h-px bg-blue-300/50 mb-2"></div>
                <p className="text-blue-100 text-sm tracking-wider">— SAFE WORK —</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
