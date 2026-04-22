'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface MoodEnergyChartProps {
  cycles: any[];
}

export default function MoodEnergyChart({ cycles }: MoodEnergyChartProps) {
  // Calculate symptom frequencies from cycle data
  const symptomData = useMemo(() => {
    if (!cycles || cycles.length === 0) {
      return [
        { label: 'MOOD', value: 60, color: 'bg-pink-300' },
        { label: 'SLEEP', value: 85, color: 'bg-purple-500' },
        { label: 'STRESS', value: 45, color: 'bg-green-300' },
        { label: 'APPETITE', value: 70, color: 'bg-pink-200' },
        { label: 'ENERGY', value: 80, color: 'bg-purple-400' },
      ];
    }

    // Count symptom occurrences
    const symptomCounts: { [key: string]: number } = {};
    let totalCycles = cycles.length;

    cycles.forEach(cycle => {
      if (cycle.symptoms && Array.isArray(cycle.symptoms)) {
        cycle.symptoms.forEach((symptom: string) => {
          symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
        });
      }
    });

    // Map symptoms to chart categories
    const symptomMapping: { [key: string]: string[] } = {
      MOOD: ['mood swings', 'irritability', 'anxiety'],
      SLEEP: ['fatigue', 'insomnia'],
      STRESS: ['stress', 'anxiety', 'headache'],
      APPETITE: ['cravings', 'bloating'],
      ENERGY: ['fatigue', 'low energy'],
    };

    const data = Object.keys(symptomMapping).map(category => {
      const relatedSymptoms = symptomMapping[category];
      const count = relatedSymptoms.reduce((sum, symptom) => {
        return sum + (symptomCounts[symptom.toLowerCase()] || 0);
      }, 0);
      
      // Calculate percentage (inverse for positive metrics like SLEEP, ENERGY)
      const percentage = totalCycles > 0 ? (count / totalCycles) * 100 : 50;
      const value = ['SLEEP', 'ENERGY'].includes(category) 
        ? Math.max(20, 100 - percentage) // Inverse for positive metrics
        : Math.min(80, percentage + 30); // Direct for negative metrics

      return {
        label: category,
        value: Math.round(value),
        color: category === 'MOOD' ? 'bg-pink-300' 
             : category === 'SLEEP' ? 'bg-purple-500'
             : category === 'STRESS' ? 'bg-green-300'
             : category === 'APPETITE' ? 'bg-pink-200'
             : 'bg-purple-400',
      };
    });

    return data;
  }, [cycles]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6 font-serif">Mood & Energy</h3>

      {/* Bar Chart */}
      <div className="flex items-end justify-between gap-3 h-48">
        {symptomData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ height: 0 }}
            animate={{ height: `${item.value}%` }}
            transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
            className="flex-1 flex flex-col items-center"
          >
            <div className={`w-full ${item.color} rounded-t-xl`} style={{ height: '100%' }}></div>
            <p className="text-xs text-gray-600 font-medium mt-3">{item.label}</p>
          </motion.div>
        ))}
      </div>

      {cycles.length > 0 && (
        <p className="text-xs text-gray-500 text-center mt-4">
          Based on {cycles.length} logged cycle{cycles.length !== 1 ? 's' : ''}
        </p>
      )}
    </motion.div>
  );
}
