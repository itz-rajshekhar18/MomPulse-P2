'use client';

import { useEffect, useState, useRef } from 'react';
import { Moon, Activity } from 'lucide-react';
import {animate} from 'animejs';

export default function WeeklyStats() {
  const [stats, setStats] = useState({
    sleep: 8.2,
    activity: 55
  });
  
  const sleepValueRef = useRef<HTMLElement>(null);
  const activityValueRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Animate stats when component mounts
  useEffect(() => {
    if (containerRef.current) {
      // Animate the container entrance
      animate(containerRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        easing: 'easeOutQuad'
      });

      // Animate sleep stat with count-up
      setTimeout(() => {
        animate({ value: 0 }, {
          value: stats.sleep,
          round: 0.1,
          duration: 1000,
          easing: 'easeOutQuad',
          update(anim: any) {
            if (sleepValueRef.current) {
              sleepValueRef.current.textContent = String(anim.progress < 100 
                ? (stats.sleep * (anim.progress / 100)).toFixed(1) 
                : stats.sleep.toFixed(1));
            }
          }
        });
      }, 200);

      // Animate activity stat with count-up
      setTimeout(() => {
        animate({ value: 0 }, {
          value: stats.activity,
          round: 1,
          duration: 900,
          easing: 'easeOutQuad',
          update(anim: any) {
            if (activityValueRef.current) {
              activityValueRef.current.textContent = String(Math.round(stats.activity * (anim.progress / 100)));
            }
          }
        });
      }, 400);
    }
  }, [stats]);

  return (
    <div ref={containerRef} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4">📊 This Week's Stats</h3>
      
      <div className="space-y-4">
        {/* Sleep */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Moon className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Sleep Zzz's</span>
            </div>
            <span className="text-sm font-bold text-gray-900"><span ref={sleepValueRef}>0</span>h avg</span>
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
            <span className="text-sm font-bold text-gray-900"><span ref={activityValueRef}>0</span>m avg</span>
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
