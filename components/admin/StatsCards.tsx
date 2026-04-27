'use client';

import { motion } from 'framer-motion';

interface StatCardProps {
  icon: string;
  iconBg: string;
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  delay: number;
}

function StatCard({ icon, iconBg, label, value, change, changeType, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <span
          className={`text-sm font-semibold ${
            changeType === 'positive' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {change}
        </span>
      </div>
      <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '75%' }}
          transition={{ duration: 1, delay: delay + 0.3 }}
          className={`h-full ${changeType === 'positive' ? 'bg-green-500' : 'bg-red-500'}`}
        />
      </div>
    </motion.div>
  );
}

export default function StatsCards() {
  const stats = [
    {
      icon: '👥',
      iconBg: 'bg-purple-100',
      label: 'Active Users',
      value: '12,842',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      icon: '📱',
      iconBg: 'bg-green-100',
      label: 'Monthly Bookings',
      value: '2,450',
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      icon: '✅',
      iconBg: 'bg-pink-100',
      label: 'Completed Sessions',
      value: '1,892',
      change: '+24%',
      changeType: 'positive' as const,
    },
    {
      icon: '💰',
      iconBg: 'bg-purple-100',
      label: 'Revenue',
      value: '$42,300',
      change: '+5%',
      changeType: 'positive' as const,
    },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={stat.label} {...stat} delay={index * 0.1} />
      ))}
    </div>
  );
}
