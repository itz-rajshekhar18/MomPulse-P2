'use client';

import { motion } from 'framer-motion';
import { Baby, Utensils, Users, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function QuickActionsGrid() {
  const router = useRouter();

  const actions = [
    {
      icon: Baby,
      label: 'Pregnancy Tracker',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      onClick: () => router.push('/dashboard/pregnancy/tracker')
    },
    {
      icon: Utensils,
      label: 'Diet Chart',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      onClick: () => router.push('/dashboard/pregnancy/diet')
    },
    {
      icon: Users,
      label: 'Group Consults',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      onClick: () => router.push('/consultation')
    },
    {
      icon: Calendar,
      label: 'My Sessions',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      onClick: () => router.push('/booking')
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
    >
      <h3 className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-6">
        Quick Actions
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              onClick={action.onClick}
              className={`${action.bgColor} rounded-2xl p-6 hover:shadow-md transition-all group`}
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-semibold text-gray-900 text-left">
                {action.label}
              </p>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
