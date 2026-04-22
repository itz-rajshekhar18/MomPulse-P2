'use client';

import { Sparkles } from 'lucide-react';

export default function PersonalGuidance() {
  return (
    <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 rounded-2xl p-6 shadow-sm border border-purple-200">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-white rounded-xl shadow-sm">
          <Sparkles className="w-6 h-6 text-purple-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Personal Daily Guidance
          </h3>
          <p className="text-gray-700 italic leading-relaxed mb-3">
            "Listen to your body today. Your pelvic floor health is improving. Consider a gentle 10-minute walking session during the soft afternoon light."
          </p>
          <div className="flex items-center space-x-4 text-sm">
            <span className="px-3 py-1 bg-white rounded-full text-purple-700 font-medium">
              PELVIC HEALTH
            </span>
            <span className="px-3 py-1 bg-white rounded-full text-purple-700 font-medium">
              ACTIVITY LEVEL: LOW
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
