'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface PersonalInformationProps {
  fullName: string;
  email: string;
  phone: string;
}

export default function PersonalInformation({ fullName, email, phone }: PersonalInformationProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 font-serif">Personal Information</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors"
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
            Full Name
          </label>
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            {isEditing ? (
              <input
                type="text"
                defaultValue={fullName}
                className="flex-1 bg-transparent outline-none text-gray-900"
              />
            ) : (
              <span className="text-gray-900">{fullName || 'Not set'}</span>
            )}
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
            Email Address
          </label>
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span className="text-gray-900">{email}</span>
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
            Phone Number
          </label>
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            {isEditing ? (
              <input
                type="tel"
                defaultValue={phone}
                className="flex-1 bg-transparent outline-none text-gray-900"
              />
            ) : (
              <span className="text-gray-900">{phone}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
