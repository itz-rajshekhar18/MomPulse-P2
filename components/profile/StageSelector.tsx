'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface StageSelectorProps {
  currentStage: 'planning' | 'pregnancy' | 'postpartum' | 'period';
}

export default function StageSelector({ currentStage }: StageSelectorProps) {
  const [selectedStage, setSelectedStage] = useState(currentStage);

  const stages = [
    {
      id: 'planning',
      label: 'PLANNING',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      id: 'postpartum',
      label: 'POSTPARTUM',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-8"
    >
      <div className="grid grid-cols-2 gap-4">
        {stages.map((stage) => (
          <button
            key={stage.id}
            onClick={() => setSelectedStage(stage.id as any)}
            className={`p-6 rounded-2xl border-2 transition-all ${
              selectedStage === stage.id
                ? 'bg-purple-50 border-purple-600'
                : 'bg-white border-gray-200 hover:border-purple-300'
            }`}
          >
            <div
              className={`flex flex-col items-center gap-3 ${
                selectedStage === stage.id ? 'text-purple-600' : 'text-gray-600'
              }`}
            >
              {stage.icon}
              <span className="text-sm font-bold tracking-wide">{stage.label}</span>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
