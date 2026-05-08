'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import Image from 'next/image';

interface UpcomingSessionCardProps {
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  doctorImage?: string;
}

export default function UpcomingSessionCard({
  doctorName,
  specialty,
  date,
  time,
  doctorImage
}: UpcomingSessionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-6 shadow-sm border border-purple-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center overflow-hidden">
            {doctorImage ? (
              <Image src={doctorImage} alt={doctorName} width={64} height={64} className="object-cover" />
            ) : (
              <span className="text-2xl text-white font-bold">
                {doctorName.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <p className="text-xs text-purple-600 uppercase tracking-wide font-semibold mb-1">
              Upcoming Session
            </p>
            <h3 className="text-lg font-bold text-gray-900 font-serif">
              {doctorName}
            </h3>
            <p className="text-sm text-gray-600">{specialty}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Calendar className="w-4 h-4 text-purple-600" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Clock className="w-4 h-4 text-purple-600" />
          <span>{time}</span>
        </div>
      </div>

      <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
        Join
      </button>
    </motion.div>
  );
}
