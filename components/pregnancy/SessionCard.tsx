'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Video } from 'lucide-react';

interface SessionCardProps {
  id: string;
  title: string;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  attendees: number;
  maxAttendees: number;
  category: string;
  color: 'pink' | 'green' | 'purple' | 'blue' | 'teal';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  onJoin?: () => void;
}

export default function SessionCard({
  title,
  instructor,
  date,
  time,
  duration,
  attendees,
  maxAttendees,
  category,
  color,
  status,
  onJoin
}: SessionCardProps) {
  const getColorClasses = (colorName: string) => {
    const colors = {
      pink: 'bg-pink-50 border-pink-200 text-pink-700',
      green: 'bg-green-50 border-green-200 text-green-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700',
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      teal: 'bg-teal-50 border-teal-200 text-teal-700',
    };
    return colors[colorName as keyof typeof colors] || colors.purple;
  };

  const getStatusBadge = () => {
    if (status === 'ongoing') {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center gap-1">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          Live Now
        </span>
      );
    }
    if (status === 'completed') {
      return (
        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
          Completed
        </span>
      );
    }
    if (status === 'cancelled') {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
          Cancelled
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
        Upcoming
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${getColorClasses(color)} rounded-2xl p-6 border-2 hover:shadow-md transition-all`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {getStatusBadge()}
            <span className="px-3 py-1 bg-white text-gray-700 text-xs font-semibold rounded-full">
              {category}
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">with {instructor}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Calendar className="w-4 h-4" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Clock className="w-4 h-4" />
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Video className="w-4 h-4" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Users className="w-4 h-4" />
          <span>{attendees}/{maxAttendees} joined</span>
        </div>
      </div>

      {status !== 'completed' && status !== 'cancelled' && (
        <button
          onClick={onJoin}
          className={`w-full px-6 py-3 ${
            status === 'ongoing'
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
          } text-white rounded-xl font-semibold transition-all`}
        >
          {status === 'ongoing' ? 'Join Now' : 'Register'}
        </button>
      )}
    </motion.div>
  );
}
