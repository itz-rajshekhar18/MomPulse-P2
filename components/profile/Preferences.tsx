'use client';

import { motion } from 'framer-motion';

export default function Preferences() {
  const preferences = [
    {
      id: 'notifications',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
      ),
      iconBg: '#ede9fe',
      iconColor: '#7c3aed',
      title: 'Notifications',
      subtitle: 'Daily tips & cycle alerts',
    },
    {
      id: 'language',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
        </svg>
      ),
      iconBg: '#d1fae5',
      iconColor: '#059669',
      title: 'Language',
      subtitle: 'English (United States)',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-3xl p-6 shadow-sm border mb-6 bg-white border-gray-100"
    >
      <h3 className="text-xl font-bold mb-6 font-serif text-gray-900">
        Preferences
      </h3>

      <div className="space-y-3">
        {preferences.map((pref, index) => (
          <motion.button
            key={pref.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            className="w-full flex items-center gap-4 p-4 rounded-2xl transition-colors hover:bg-gray-50"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: pref.iconBg, color: pref.iconColor }}>
              {pref.icon}
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-bold mb-1 text-gray-900">{pref.title}</h4>
              <p className="text-sm text-gray-500">{pref.subtitle}</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
