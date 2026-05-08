'use client';

import { motion } from 'framer-motion';
import { Plus, AlertCircle, Zap, Eye } from 'lucide-react';

interface Symptom {
  id: string;
  name: string;
  description: string;
  icon: string;
  severity?: 'mild' | 'moderate' | 'severe';
}

interface SymptomsCardProps {
  symptoms: Symptom[];
  onAddSymptom?: () => void;
  updatedTime?: string;
}

export default function SymptomsCard({ 
  symptoms, 
  onAddSymptom,
  updatedTime = '2h ago'
}: SymptomsCardProps) {
  const getSymptomIcon = (iconName: string) => {
    switch (iconName) {
      case 'back':
        return '🔴';
      case 'energy':
        return '⚡';
      case 'dreams':
        return '👁️';
      default:
        return '💊';
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'severe':
        return 'bg-red-50 border-red-200';
      case 'moderate':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Body & Symptoms</h3>
        <span className="text-xs text-gray-500">Updated {updatedTime}</span>
      </div>

      <div className="space-y-3">
        {symptoms.map((symptom, index) => (
          <motion.div
            key={symptom.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            className={`${getSeverityColor(symptom.severity)} rounded-2xl p-4 border`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 text-xl">
                {getSymptomIcon(symptom.icon)}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">
                  {symptom.name}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {symptom.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        <button
          onClick={onAddSymptom}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl hover:border-purple-400 hover:bg-purple-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-purple-600"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Log new symptom</span>
        </button>
      </div>
    </motion.div>
  );
}
