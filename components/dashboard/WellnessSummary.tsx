'use client';

import { Moon, Droplets, Smile } from 'lucide-react';

export default function WellnessSummary() {
  const metrics = [
    {
      icon: Moon,
      label: 'Sleep',
      value: '4h 12m',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      icon: Droplets,
      label: 'Water',
      value: '2.1L',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      icon: Smile,
      label: 'Mood',
      value: 'Peaceful',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Wellness Summary
      </h3>
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 ${metric.bgColor} rounded-lg`}>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <span className="text-gray-700 font-medium">{metric.label}</span>
            </div>
            <span className="text-gray-900 font-semibold">{metric.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
