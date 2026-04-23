'use client';

import { useEffect, useState } from 'react';
import { Moon, Activity } from 'lucide-react';

export default function WeeklyStats() {
  const [stats, setStats] = useState({
    sleep: 8.2,
    activity: 55
  });

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4">📊 This Week's Stats</h3>
      
      <div className="space-y-4">
        {/* Sleep */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Moon className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Sleep Zzz's</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{stats.sleep}h avg</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${(stats.sleep / 10) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Activity */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Activity/Sports</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{stats.activity}m avg</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all"
              style={{ width: `${(stats.activity / 60) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
