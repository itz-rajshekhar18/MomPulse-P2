'use client';

import { Calendar, Video } from 'lucide-react';
import Link from 'next/link';

export default function UpcomingConsultations() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Upcoming Consultations</h3>
        <Link href="/consultation" className="text-purple-600 hover:text-purple-700 text-sm font-semibold">
          View All
        </Link>
      </div>

      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
        <div className="flex items-center space-x-4">
          <img 
            src="https://i.pravatar.cc/150?img=5" 
            alt="Dr. Sarah Mitchell"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h4 className="font-bold text-gray-900">Dr. Sarah Mitchell</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Postpartum check-up • Tomorrow, 10:30 AM</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center space-x-2">
            <Video className="w-4 h-4" />
            <span>Join Call</span>
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            Reschedule
          </button>
        </div>
      </div>
    </div>
  );
}
