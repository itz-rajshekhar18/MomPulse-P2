'use client';

import { motion } from 'framer-motion';
import { AlertCircle, Coffee, Fish } from 'lucide-react';

interface Reminder {
  id: string;
  title: string;
  description: string;
  icon: 'fish' | 'cheese' | 'coffee';
}

interface GentleRemindersCardProps {
  reminders: Reminder[];
}

export default function GentleRemindersCard({ reminders }: GentleRemindersCardProps) {
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'fish':
        return <Fish className="w-5 h-5" />;
      case 'coffee':
        return <Coffee className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getIconBg = (iconType: string) => {
    switch (iconType) {
      case 'fish':
        return 'bg-blue-50 text-blue-600';
      case 'coffee':
        return 'bg-orange-50 text-orange-600';
      default:
        return 'bg-purple-50 text-purple-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center gap-2 mb-6">
        <AlertCircle className="w-5 h-5 text-orange-600" />
        <h3 className="text-lg font-bold text-gray-900">Gentle Reminders</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        To ensure yours and baby's wellness, try to limit or avoid these items for now:
      </p>

      <div className="space-y-3">
        {reminders.map((reminder, index) => (
          <motion.div
            key={reminder.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
          >
            <div className={`w-10 h-10 ${getIconBg(reminder.icon)} rounded-lg flex items-center justify-center flex-shrink-0`}>
              {getIcon(reminder.icon)}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-sm mb-1">
                {reminder.title}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {reminder.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
