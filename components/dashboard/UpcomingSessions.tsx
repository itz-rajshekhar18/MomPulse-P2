'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, ChevronRight, Video, Users } from 'lucide-react';
import Link from 'next/link';
import { getUpcomingSessions, Session } from '@/lib/firestore';

export default function UpcomingSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const sessionsData = await getUpcomingSessions(2);
        setSessions(sessionsData);
      } catch (error) {
        console.error('Error fetching upcoming sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const day = date.getDate();
    return { month, day };
  };

  // Helper function to get color based on session color
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string }> = {
      'purple': { bg: 'bg-purple-100', text: 'text-purple-700' },
      'pink': { bg: 'bg-pink-100', text: 'text-pink-700' },
      'green': { bg: 'bg-green-100', text: 'text-green-700' },
      'blue': { bg: 'bg-blue-100', text: 'text-blue-700' },
      'teal': { bg: 'bg-teal-100', text: 'text-teal-700' },
    };
    return colorMap[color] || { bg: 'bg-gray-100', text: 'text-gray-700' };
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Sessions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-[70px] h-20 bg-gray-200 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Sessions</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.length > 0 ? (
          sessions.map((session) => {
            const { month, day } = formatDate(session.date);
            const colors = getColorClasses(session.color);

            return (
              <Link
                key={session.id}
                href="/consultation"
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:scale-[1.02] transition-all duration-200 group"
              >
                <div className="flex items-start space-x-4">
                  {/* Date Badge */}
                  <div className={`${colors.bg} rounded-xl p-4 text-center min-w-[70px]`}>
                    <div className={`text-xs font-semibold ${colors.text} uppercase`}>
                      {month}
                    </div>
                    <div className={`text-2xl font-bold ${colors.text} mt-1`}>
                      {day}
                    </div>
                  </div>

                  {/* Session Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {session.title}
                      </h3>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{session.time}</span>
                        <Users className="w-4 h-4 ml-2" />
                        <span>{session.attendees} attending</span>
                      </div>
                      {session.instructor && (
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">with {session.instructor}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-2 text-center py-8 text-gray-500">
            No upcoming sessions scheduled. Check back soon!
          </div>
        )}
      </div>
    </div>
  );
}
