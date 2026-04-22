'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getDeliveryInfo, getRecoveryLogs } from '@/lib/firestore';
import { generatePersonalizedTimeline } from '@/lib/recovery/timelineModel';

export default function RecoveryTimeline() {
  const { user } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(0);
  const [progress, setProgress] = useState(0);
  const [healingStatus, setHealingStatus] = useState('HEALING WELL');
  const [timeline, setTimeline] = useState<any[]>([]);

  useEffect(() => {
    const loadTimeline = async () => {
      if (!user) return;

      try {
        const deliveryInfo = await getDeliveryInfo(user.uid);
        const logs = await getRecoveryLogs(user.uid);

        if (deliveryInfo && logs.length > 0) {
          const deliveryDate = new Date(deliveryInfo.deliveryDate);
          const today = new Date();
          const daysSince = Math.floor((today.getTime() - deliveryDate.getTime()) / (1000 * 60 * 60 * 24));
          const week = Math.floor(daysSince / 7);
          
          setCurrentWeek(week);

          // Calculate progress based on recovery score
          const latestLog = logs[logs.length - 1];
          setProgress(Math.round(latestLog.recoveryScore));

          // Determine healing status
          if (latestLog.recoveryScore >= 75) {
            setHealingStatus('HEALING WELL');
          } else if (latestLog.recoveryScore >= 50) {
            setHealingStatus('PROGRESSING');
          } else {
            setHealingStatus('NEEDS ATTENTION');
          }

          // Generate personalized timeline
          const personalizedTimeline = generatePersonalizedTimeline(logs, deliveryInfo.deliveryType);
          
          // Create week markers for display
          const weeks = [];
          for (let i = 0; i <= Math.min(week + 1, 8); i++) {
            weeks.push({
              week: i,
              label: i === week ? 'TODAY' : `WEEK ${i}`,
              completed: i < week,
              current: i === week,
            });
          }
          setTimeline(weeks);
        }
      } catch (error) {
        console.error('Error loading timeline:', error);
      }
    };

    loadTimeline();
  }, [user]);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">Week {currentWeek} after delivery</h3>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
            {progress}% Progress
          </span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${
            healingStatus === 'HEALING WELL' ? 'bg-green-500' : 
            healingStatus === 'PROGRESSING' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          <span className={`font-medium ${
            healingStatus === 'HEALING WELL' ? 'text-green-700' : 
            healingStatus === 'PROGRESSING' ? 'text-yellow-700' : 'text-red-700'
          }`}>{healingStatus}</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {timeline.map((item, index) => (
            <div key={index} className="flex flex-col items-center relative">
              {/* Connector Line */}
              {index < timeline.length - 1 && (
                <div 
                  className={`absolute top-5 left-1/2 w-full h-0.5 ${
                    item.completed ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                  style={{ transform: 'translateX(50%)' }}
                />
              )}
              
              {/* Circle */}
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 ${
                  item.current 
                    ? 'bg-purple-600 ring-4 ring-purple-200' 
                    : item.completed 
                    ? 'bg-purple-600' 
                    : 'bg-gray-300'
                }`}
              >
                {item.completed ? (
                  <Check className="w-5 h-5 text-white" />
                ) : item.current ? (
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                ) : (
                  <div className="w-3 h-3 bg-white rounded-full opacity-50"></div>
                )}
              </div>
              
              {/* Label */}
              <span className={`mt-2 text-xs font-semibold ${
                item.current ? 'text-purple-600' : 'text-gray-600'
              }`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
