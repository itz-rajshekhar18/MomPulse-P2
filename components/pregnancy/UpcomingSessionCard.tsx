'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import Image from 'next/image';

interface UpcomingSessionCardProps {
  doctorName?: string;
  specialty?: string;
  date?: string;
  time?: string;
  doctorImage?: string;
  isLoading?: boolean;
}

export default function UpcomingSessionCard({
  doctorName,
  specialty,
  date,
  time,
  doctorImage,
  isLoading = false
}: UpcomingSessionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-6 shadow-sm border border-purple-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4 w-full">
          {isLoading ? (
            <>
              <div className="w-16 h-16 bg-purple-300/50 rounded-2xl animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 bg-purple-300/50 rounded animate-pulse"></div>
                <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </>
          ) : !doctorName ? (
            <div className="w-full text-center py-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 font-serif mb-1">
                No Upcoming Sessions
              </h3>
              <p className="text-sm text-gray-600">
                Book a consultation with our experts.
              </p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
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
            </>
          )}
        </div>
      </div>

      {!isLoading && doctorName && (
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
      )}

      {!isLoading && (
        <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all mt-2">
          {doctorName ? 'Join Session' : 'Book Consultation'}
        </button>
      )}
    </motion.div>
  );
}
