'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAdminStats, AdminStats } from '@/lib/firestore';

interface StatCardProps {
  icon: string;
  iconBg: string;
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  delay: number;
  loading?: boolean;
}

function StatCard({ icon, iconBg, label, value, change, changeType, delay, loading }: StatCardProps) {
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
        {loading ? (
          <div className="w-12 h-5 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          <span
            className={`text-sm font-semibold ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {change}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">{label}</p>
      {loading ? (
        <div className="h-9 bg-gray-200 rounded animate-pulse w-32"></div>
      ) : (
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      )}
      <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: loading ? '50%' : '75%' }}
          transition={{ duration: 1, delay: delay + 0.3 }}
          className={`h-full ${changeType === 'positive' ? 'bg-green-500' : 'bg-red-500'}`}
        />
      </div>
    </motion.div>
  );
}

export default function StatsCards() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('Fetching admin stats...');
        const statsData = await getAdminStats();
        console.log('Stats fetched:', statsData);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  const formatCurrency = (num: number): string => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`;
    }
    return `$${num.toLocaleString()}`;
  };

  const formatChange = (change: number): string => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change}%`;
  };

  const getChangeType = (change: number): 'positive' | 'negative' => {
    return change >= 0 ? 'positive' : 'negative';
  };

  const statsCards = stats ? [
    {
      icon: '👥',
      iconBg: 'bg-purple-100',
      label: 'Active Users',
      value: formatNumber(stats.activeUsers),
      change: formatChange(stats.userGrowth),
      changeType: getChangeType(stats.userGrowth),
    },
    {
      icon: '📱',
      iconBg: 'bg-green-100',
      label: 'Monthly Bookings',
      value: formatNumber(stats.monthlyBookings),
      change: formatChange(stats.bookingGrowth),
      changeType: getChangeType(stats.bookingGrowth),
    },
    {
      icon: '✅',
      iconBg: 'bg-pink-100',
      label: 'Completed Sessions',
      value: formatNumber(stats.completedSessions),
      change: formatChange(stats.sessionGrowth),
      changeType: getChangeType(stats.sessionGrowth),
    },
    {
      icon: '💰',
      iconBg: 'bg-purple-100',
      label: 'Revenue',
      value: formatCurrency(stats.revenue),
      change: formatChange(stats.revenueGrowth),
      changeType: getChangeType(stats.revenueGrowth),
    },
  ] : [
    {
      icon: '👥',
      iconBg: 'bg-purple-100',
      label: 'Active Users',
      value: '0',
      change: '+0%',
      changeType: 'positive' as const,
    },
    {
      icon: '📱',
      iconBg: 'bg-green-100',
      label: 'Monthly Bookings',
      value: '0',
      change: '+0%',
      changeType: 'positive' as const,
    },
    {
      icon: '✅',
      iconBg: 'bg-pink-100',
      label: 'Completed Sessions',
      value: '0',
      change: '+0%',
      changeType: 'positive' as const,
    },
    {
      icon: '💰',
      iconBg: 'bg-purple-100',
      label: 'Revenue',
      value: '$0',
      change: '+0%',
      changeType: 'positive' as const,
    },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((stat, index) => (
        <StatCard key={stat.label} {...stat} delay={index * 0.1} loading={loading} />
      ))}
    </div>
  );
}
