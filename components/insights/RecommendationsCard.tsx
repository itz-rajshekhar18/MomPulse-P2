'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface Recommendation {
  category: string;
  title: string;
  description: string;
  icon: string;
  color: 'green' | 'orange' | 'blue';
}

interface RecommendationsCardProps {
  prediction?: {
    cycle_regularity: string;
    avg_cycle_length: number;
    confidence: string;
  } | null;
  cycles: any[];
}

export default function RecommendationsCard({ prediction, cycles }: RecommendationsCardProps) {
  // Generate recommendations based on real data
  const recommendations: Recommendation[] = useMemo(() => {
    const recs: Recommendation[] = [];

    // Recommendation based on cycle regularity
    if (prediction) {
      if (prediction.cycle_regularity === 'irregular' || prediction.cycle_regularity === 'somewhat irregular') {
        recs.push({
          category: 'Stress',
          title: 'Focus on stress management',
          description: 'Irregular cycles can be influenced by stress. Try 10-minute daily meditation.',
          icon: '🧘',
          color: 'orange',
        });
      } else {
        recs.push({
          category: 'Nutrition',
          title: 'Maintain balanced nutrition',
          description: 'Your regular cycle indicates good health. Keep up your current diet.',
          icon: '🥗',
          color: 'green',
        });
      }

      // Recommendation based on confidence
      if (prediction.confidence === 'low') {
        recs.push({
          category: 'Tracking',
          title: 'Log more cycles for accuracy',
          description: 'More data will improve prediction accuracy. Keep tracking consistently.',
          icon: '📊',
          color: 'blue',
        });
      } else if (prediction.confidence === 'high') {
        recs.push({
          category: 'Activity',
          title: 'Light walking or yoga recommended',
          description: 'Maintain moderate exercise during your fertile window.',
          icon: '🚶‍♀️',
          color: 'green',
        });
      }
    } else {
      // Default recommendations
      recs.push(
        {
          category: 'Nutrition',
          title: 'Light walking or yoga recommended',
          description: 'Avoid high intensity workouts this week.',
          icon: '🥗',
          color: 'green',
        },
        {
          category: 'Stress',
          title: '10-minute mindfulness practice',
          description: 'At sunset to regulate cortisol levels.',
          icon: '🧘',
          color: 'orange',
        }
      );
    }

    return recs;
  }, [prediction, cycles]);

  const colorClasses = {
    green: 'bg-green-50 border-green-200',
    orange: 'bg-orange-50 border-orange-200',
    blue: 'bg-blue-50 border-blue-200',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6 font-serif flex items-center gap-2">
        Recommendations
        <span className="text-2xl">🌿</span>
      </h3>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
            className={`p-4 rounded-2xl border-2 ${colorClasses[rec.color]}`}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">{rec.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    {rec.category}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{rec.title}</h4>
                <p className="text-sm text-gray-600">{rec.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
