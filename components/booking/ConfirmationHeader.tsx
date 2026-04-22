'use client';

import { motion } from 'framer-motion';

interface ConfirmationHeaderProps {
  doctorImage?: string;
}

export default function ConfirmationHeader({ doctorImage }: ConfirmationHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      {/* Doctor Image */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-teal-900 to-teal-800 overflow-hidden shadow-2xl">
            {/* Placeholder for doctor image */}
            <div className="w-full h-full bg-gradient-to-br from-teal-700 to-teal-900"></div>
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-purple-400 opacity-20 blur-3xl -z-10"></div>
        </div>
      </div>

      {/* Confirmation Message */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4 font-serif"
      >
        You're all set! Your session is confirmed.{' '}
        <span className="inline-block">💜</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-gray-600 text-lg"
      >
        We've sent the details to your email. We're looking forward to
        <br />
        seeing you.
      </motion.p>
    </motion.div>
  );
}
