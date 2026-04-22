'use client';

import { motion } from 'framer-motion';

interface SessionDetailsCardProps {
  doctorName: string;
  sessionType: string;
  date: string;
  time: string;
  doctorImage?: string;
}

export default function SessionDetailsCard({
  doctorName,
  sessionType,
  date,
  time,
  doctorImage,
}: SessionDetailsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100"
    >
      <div className="flex items-start gap-6">
        {/* Doctor Image */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 overflow-hidden flex-shrink-0 shadow-md">
          {/* Placeholder for doctor image */}
          <div className="w-full h-full bg-gradient-to-br from-teal-500 to-teal-700"></div>
        </div>

        {/* Session Details */}
        <div className="flex-1">
          {/* Badge */}
          <div className="inline-block px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium mb-3">
            CONFIRMED SESSION
          </div>

          {/* Doctor Name */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2 font-serif">
            {doctorName}
          </h2>

          {/* Session Type */}
          <p className="text-purple-600 font-medium mb-4">{sessionType}</p>

          {/* Date and Time */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="font-medium">{date}</span>
            </div>

            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">{time}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
