'use client';

import { motion } from 'framer-motion';

interface SpecialistCardProps {
  name: string;
  title: string;
  specialty: string;
  experience: string;
  rating: number;
  image?: string;
  delay?: number;
}

export default function SpecialistCard({
  name,
  title,
  specialty,
  experience,
  rating,
  image,
  delay = 0,
}: SpecialistCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
    >
      {/* Image Section */}
      <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {/* Placeholder for specialist photo */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400"></div>
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow-lg">
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm font-bold text-gray-900">{rating}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1 font-serif">{name}</h3>
        <p className="text-purple-600 font-medium mb-3">{title}</p>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{specialty}</p>
        <p className="text-gray-500 text-sm mb-6">{experience}</p>

        <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 group-hover:scale-105">
          Book Consultation
        </button>
      </div>
    </motion.div>
  );
}
