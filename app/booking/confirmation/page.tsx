'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ConfirmationHeader from '@/components/booking/ConfirmationHeader';
import SessionDetailsCard from '@/components/booking/SessionDetailsCard';
import PreparationCard from '@/components/booking/PreparationCard';
import ActionButtons from '@/components/booking/ActionButtons';
import BookingFooter from '@/components/booking/BookingFooter';

export default function BookingConfirmationPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    setLoading(false);
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
      {/* Simple Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold text-purple-600 font-serif">
            MomPulse
          </Link>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            <Link href="/dashboard">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:shadow-md transition-shadow">
                {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Confirmation Header */}
          <ConfirmationHeader />

          {/* Session Details and Preparation Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <SessionDetailsCard
              doctorName="Dr. Elena Rossi"
              sessionType="Postpartum Recovery Consultation"
              date="October 24, 2024"
              time="10:00 AM - 11:00 AM"
            />

            <PreparationCard
              doctorName="Dr. Rossi"
              sessionStartsIn="15 mins"
            />
          </div>

          {/* Action Buttons */}
          <ActionButtons />
        </div>
      </main>

      {/* Footer */}
      <BookingFooter />
    </div>
  );
}
