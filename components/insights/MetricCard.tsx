'use client';

import { motion } from 'framer-motion';

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  status?: 'stable' | 'high' | 'low';
  color?: 'purple' | 'green' | 'blue';
  delay?: number;
}

export default function MetricCard({
  label,
  value,
  unit,
  status,
  color = 'purple',
  delay = 0,
}: MetricCardProps) {
  const colorClasses = {
    purple: 'text-purple-600',
    green: 'text-green-600',
    blue: 'text-purple-600',
  };

  const statusIcons = {
    stable: (
      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    high: (
      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    low: (
      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{label}</p>
      <div className="flex items-end gap-2">
        <h3 className={`text-4xl font-bold ${colorClasses[color]}`}>{value}</h3>
        {unit && <span className="text-gray-600 mb-1">{unit}</span>}
        {status && <div className="mb-1 ml-2">{statusIcons[status]}</div>}
      </div>
    </motion.div>
  );
}
