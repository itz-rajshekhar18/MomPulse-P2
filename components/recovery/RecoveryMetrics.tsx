'use client';

import { useEffect, useState } from 'react';
import { Heart, Moon, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getRecoveryLogs } from '@/lib/firestore';

export default function RecoveryMetrics() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({
    physicalHealing: 0,
    sleepHours: 0,
    dailySteps: 0,
  });

  useEffect(() => {
    const loadMetrics = async () => {
      if (!user) return;

      try {
        const logs = await getRecoveryLogs(user.uid);
        
        if (logs.length > 0) {
          const latestLog = logs[logs.length - 1];
          const recentLogs = logs.slice(-7); // Last 7 days

          // Calculate average sleep
          const avgSleep = recentLogs.reduce((sum, log) => sum + log.sleep, 0) / recentLogs.length;

          setMetrics({
            physicalHealing: Math.round(latestLog.recoveryScore),
            sleepHours: Math.round(avgSleep * 10) / 10,
            dailySteps: latestLog.activity,
          });
        }
      } catch (error) {
        console.error('Error loading metrics:', error);
      }
    };

    loadMetrics();
  }, [user]);

  const metricsData = [
    {
      icon: Heart,
      label: 'Physical Healing',
      value: `${metrics.physicalHealing}% Recovered`,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      progress: metrics.physicalHealing,
      progressColor: 'bg-green-600'
    },
    {
      icon: Moon,
      label: 'Sleep Quality',
      value: `${metrics.sleepHours} Hours`,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      bars: [20, 40, 60, 80, 100],
      activeBar: Math.min(Math.floor(metrics.sleepHours / 2), 4)
    },
    {
      icon: Activity,
      label: 'Daily Activity',
      value: `${metrics.dailySteps.toLocaleString()} Steps`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      progress: Math.min((metrics.dailySteps / 8000) * 100, 100),
      progressColor: 'bg-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metricsData.map((metric, index) => (
        <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 ${metric.bgColor} rounded-xl`}>
              <metric.icon className={`w-6 h-6 ${metric.color}`} />
            </div>
          </div>
          <h3 className="text-sm text-gray-600 font-semibold mb-1 uppercase tracking-wide">
            {metric.label}
          </h3>
          <p className="text-2xl font-bold text-gray-900 mb-3">{metric.value}</p>
          
          {/* Progress Bar or Sleep Bars */}
          {metric.progress !== undefined ? (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`${metric.progressColor} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${metric.progress}%` }}
              ></div>
            </div>
          ) : metric.bars ? (
            <div className="flex items-end space-x-1 h-12">
              {metric.bars.map((height, i) => (
                <div 
                  key={i}
                  className={`flex-1 rounded-t ${
                    i <= metric.activeBar! ? 'bg-pink-400' : 'bg-pink-200'
                  }`}
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
