'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface DailyMoodCardProps {
  selectedMood?: string;
  onMoodSelect?: (mood: string) => void;
}

export default function DailyMoodCard({ 
  selectedMood, 
  onMoodSelect 
}: DailyMoodCardProps) {
  const moods = [
    { emoji: '😊', label: 'Happy', value: 'happy' },
    { emoji: '😌', label: 'Calm', value: 'calm' },
    { emoji: '😴', label: 'Tired', value: 'tired' },
    { emoji: '😰', label: 'Anxious', value: 'anxious' },
    { emoji: '😢', label: 'Sad', value: 'sad' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-6">Daily Mood</h3>

      <div className="flex items-center justify-between gap-2">
        {moods.map((mood, index) => (
          <motion.button
            key={mood.value}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
            onClick={() => onMoodSelect?.(mood.value)}
            className={`flex-1 aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${
              selectedMood === mood.value
                ? 'bg-purple-100 ring-2 ring-purple-500 scale-105'
                : 'bg-purple-50 hover:bg-purple-100'
            }`}
          >
            <span className="text-3xl">{mood.emoji}</span>
            <span className="text-xs font-medium text-gray-700">{mood.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
