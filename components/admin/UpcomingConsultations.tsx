'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUpcomingSessions, Session } from '@/lib/firestore';

export default function UpcomingConsultations() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        console.log('Fetching sessions...');
        const sessionsData = await getUpcomingSessions(3);
        console.log('Sessions fetched:', sessionsData);
        setSessions(sessionsData);
      } catch (error: any) {
        console.error('Error fetching sessions:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        // If permission error, it might be because rules aren't deployed or user isn't authenticated
        if (error.code === 'permission-denied') {
          console.warn('Permission denied - check if:');
          console.warn('1. You are logged in as admin@admin.com');
          console.warn('2. Firestore rules have been deployed');
          console.warn('3. The admin user exists in Firebase Authentication');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Consultations</h2>

      {/* Consultations List */}
      <div className="space-y-4">
        {sessions.length > 0 ? (
          sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {/* Date Badge */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-purple-100 rounded-xl flex flex-col items-center justify-center">
                  <span className="text-xs font-semibold text-purple-600">{session.date.split(' ')[0]}</span>
                  <span className="text-xl font-bold text-purple-600">{session.date.split(' ')[1] || session.date}</span>
                </div>

                {/* Session Details */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900">{session.title}</h3>
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                        session.color === 'purple'
                          ? 'bg-purple-100 text-purple-700'
                          : session.color === 'pink'
                          ? 'bg-pink-100 text-pink-700'
                          : session.color === 'green'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {session.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {session.instructor ? `w/ ${session.instructor}` : `${session.attendees} attendees`}
                  </p>
                  <p className="text-sm text-gray-500">{session.time}</p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No upcoming sessions scheduled.
          </div>
        )}
      </div>

      {/* Weekly Health Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
      >
        Weekly Health Report
      </motion.button>
    </motion.div>
  );
}
