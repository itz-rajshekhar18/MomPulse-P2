'use client';

import { TrendingUp, Moon } from 'lucide-react';

export default function WeeklyImprovement() {
  const milestones = [
    {
      icon: TrendingUp,
      label: 'Milestone',
      title: 'First 20min Walk',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      icon: Moon,
      label: 'Milestone',
      title: 'RestFul Night (4h+)',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

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
