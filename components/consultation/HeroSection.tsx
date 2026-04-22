'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
              EXPERT GUIDANCE
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-serif">
              Your Personal <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Wellness
              </span>
              <br />
              Sanctuary.
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Connect with world-class specialists that cater to your
              <br />
              unique motherhood journey. Safe, legal, licensed, &
              <br />
              exam board-certified.
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
                Book Consultation
              </button>
              <button className="px-8 py-4 bg-white text-gray-700 rounded-full font-medium border-2 border-gray-200 hover:border-purple-300 transition-all duration-300">
                Join Free Plan
              </button>
            </div>
          </motion.div>

          {/* Right Content - Doctor Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-teal-900 to-teal-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-700 rounded-full opacity-20 -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-600 rounded-full opacity-20 -ml-24 -mb-24"></div>

              {/* Doctor Image */}
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-pink-400 to-pink-500 rounded-2xl p-1 mb-6">
                  <div className="bg-teal-800 rounded-2xl p-8">
                    <div className="w-full h-64 bg-gradient-to-br from-pink-300 to-pink-400 rounded-xl flex items-end justify-center overflow-hidden">
                      {/* Placeholder for doctor illustration */}
                      <div className="w-48 h-48 bg-pink-500 rounded-full mb-0"></div>
                    </div>
                  </div>
                </div>

                {/* Info Card */}
                <div className="bg-white rounded-2xl p-4 shadow-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">Dr. Emily Yu</h3>
                      <p className="text-sm text-gray-600">
                        Specializing in prenatal care and
                        <br />
                        maternal wellness with 15+ years
                        <br />
                        of experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
