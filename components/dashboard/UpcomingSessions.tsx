'use client';

import { Calendar, Clock, MapPin, ChevronRight, Video, Users } from 'lucide-react';
import Link from 'next/link';

export default function UpcomingSessions() {
  const sessions = [
    {
      date: 'OCT',
      day: '24',
      title: 'Live Yoga for Recovery',
      time: '4:00 PM',
      instructor: 'with Dr. Elena Rose',
      type: 'video',
      color: 'bg-purple-100',
      textColor: 'text-purple-700'
    },
    {
      date: 'OCT',
      day: '26',
      title: 'Group Chat: Sleep Strategies',
      time: '10:30 AM',
      instructor: 'with Dr. Ranya Jones',
      type: 'group',
      color: 'bg-pink-100',
      textColor: 'text-pink-700'
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Sessions</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((session, index) => (
          <Link
            key={index}
            href="/consultation"
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:scale-[1.02] transition-all duration-200 group"
          >
            <div className="flex items-start space-x-4">
              {/* Date Badge */}
              <div className={`${session.color} rounded-xl p-4 text-center min-w-[70px]`}>
                <div className={`text-xs font-semibold ${session.textColor} uppercase`}>
                  {session.date}
                </div>
                <div className={`text-2xl font-bold ${session.textColor} mt-1`}>
                  {session.day}
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
                    {session.type === 'video' && <Video className="w-4 h-4 ml-2" />}
                    {session.type === 'group' && <Users className="w-4 h-4 ml-2" />}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">{session.instructor}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
