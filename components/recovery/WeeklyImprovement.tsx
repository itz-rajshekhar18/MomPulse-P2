'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Moon, Activity, Heart, Zap, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getRecoveryLogs } from '@/lib/firestore';

interface Milestone {
  icon: any;
  label: string;
  title: string;
  color: string;
  bgColor: string;
}

export default function WeeklyImprovement() {
  const { user } = useAuth();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detectMilestones = async () => {
      if (!user) return;

      try {
        const logs = await getRecoveryLogs(user.uid);
        const detected: Milestone[] = [];

        if (logs.length === 0) {
          setLoading(false);
          return;
        }

        // Get last 7 days of logs
        const lastWeek = logs.slice(-7);
        const previousWeek = logs.slice(-14, -7);

        // Milestone 1: First 20min walk (2000+ steps)
        const hasWalked = lastWeek.some(log => log.activity >= 2000);
        const hadWalkedBefore = previousWeek.some(log => log.activity >= 2000);
        if (hasWalked && !hadWalkedBefore) {
          detected.push({
            icon: TrendingUp,
            label: 'MILESTONE',
            title: 'First 20min Walk',
            color: 'text-teal-600',
            bgColor: 'bg-teal-50'
          });
        }

        // Milestone 2: Restful night (4h+ sleep)
        const hasSlept4h = lastWeek.some(log => log.sleep >= 4);
        const hadSlept4hBefore = previousWeek.some(log => log.sleep >= 4);
        if (hasSlept4h && !hadSlept4hBefore) {
          detected.push({
            icon: Moon,
            label: 'MILESTONE',
            title: 'RestFul Night (4h+)',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
          });
        }

        // Milestone 3: Energy boost (energy > 7)
        const hasHighEnergy = lastWeek.some(log => log.energy >= 7);
        const hadHighEnergyBefore = previousWeek.some(log => log.energy >= 7);
        if (hasHighEnergy && !hadHighEnergyBefore) {
          detected.push({
            icon: Zap,
            label: 'MILESTONE',
            title: 'Energy Boost (7+)',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50'
          });
        }

        // Milestone 4: Pain reduction (pain < 4)
        const hasLowPain = lastWeek.some(log => log.pain <= 3);
        const hadLowPainBefore = previousWeek.some(log => log.pain <= 3);
        if (hasLowPain && !hadLowPainBefore) {
          detected.push({
            icon: Heart,
            label: 'MILESTONE',
            title: 'Pain Reduced (<4)',
            color: 'text-pink-600',
            bgColor: 'bg-pink-50'
          });
        }

        // Milestone 5: Active day (5000+ steps)
        const hasActiveDay = lastWeek.some(log => log.activity >= 5000);
        const hadActiveDayBefore = previousWeek.some(log => log.activity >= 5000);
        if (hasActiveDay && !hadActiveDayBefore) {
          detected.push({
            icon: Activity,
            label: 'MILESTONE',
            title: 'Active Day (5000+ steps)',
            color: 'text-green-600',
            bgColor: 'bg-green-50'
          });
        }

        // Milestone 6: Recovery score improvement (10+ points)
        if (lastWeek.length >= 2 && previousWeek.length >= 2) {
          const avgLastWeek = lastWeek.reduce((sum, log) => sum + log.recoveryScore, 0) / lastWeek.length;
          const avgPrevWeek = previousWeek.reduce((sum, log) => sum + log.recoveryScore, 0) / previousWeek.length;
          if (avgLastWeek - avgPrevWeek >= 10) {
            detected.push({
              icon: Award,
              label: 'MILESTONE',
              title: `Recovery +${Math.round(avgLastWeek - avgPrevWeek)} pts`,
              color: 'text-indigo-600',
              bgColor: 'bg-indigo-50'
            });
          }
        }

        // Show top 2 milestones
        setMilestones(detected.slice(0, 2));
      } catch (error) {
        console.error('Error detecting milestones:', error);
      } finally {
        setLoading(false);
      }
    };

    detectMilestones();
  }, [user]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 shadow-sm border border-green-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Improvement</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  if (milestones.length === 0) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 shadow-sm border border-green-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Improvement</h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🌱</div>
          <p className="text-gray-600 text-sm">
            Keep logging daily to track your milestones!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 shadow-sm border border-green-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Improvement</h3>
      
      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className={`p-3 ${milestone.bgColor} rounded-xl`}>
              <milestone.icon className={`w-5 h-5 ${milestone.color}`} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                {milestone.label}
              </p>
              <p className="text-gray-900 font-semibold">{milestone.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
