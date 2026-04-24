'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getUserProfile } from '@/lib/firestore';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import HeroSection from '@/components/consultation/HeroSection';
import PricingCard from '@/components/consultation/PricingCard';
import SpecialistCard from '@/components/consultation/SpecialistCard';
import SessionCard from '@/components/consultation/SessionCard';
import FloatingLeaves from '@/components/animations/FloatingLeaves';

export default function ConsultationPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showRecovery, setShowRecovery] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const loadUserData = async () => {
      try {
        const profile = await getUserProfile(user.uid);

        // Set user name
        if (profile?.displayName) {
          setUserName(profile.displayName.split(' ')[0]);
        } else if (user.email) {
          setUserName(user.email.split('@')[0]);
        }

        // Determine if user is in postpartum stage
        setShowRecovery(profile?.currentStage === 'postpartum');
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
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

  const essentialFeatures = [
    'Basic wellness insights',
    'Monthly Newsletter',
    'Community Access',
  ];

  const premiumFeatures = [
    '24/7 AI Assistant',
    '1-on-1 Monthly Specialist',
    'Personalized Care Plans',
    'Priority Booking',
  ];

  const specialists = [
    {
      name: 'Dr. Elaina Rossi',
      title: 'OB-GYN Specialist',
      specialty: 'Expert in high-risk pregnancies and prenatal care with a compassionate approach to maternal health.',
      experience: '18 Years of Experience',
      rating: 4.9,
    },
    {
      name: 'Marcus Chen',
      title: 'Certified Midwife',
      specialty: 'Specializing in natural birth support and holistic maternal wellness throughout pregnancy.',
      experience: '12 Years of Experience',
      rating: 5.0,
    },
    {
      name: 'Sarah Jenkins',
      title: 'Lactation Consultant',
      specialty: 'Dedicated to helping new mothers navigate breastfeeding challenges with expert guidance and support.',
      experience: '10 Years of Experience',
      rating: 4.8,
    },
  ];

  const upcomingSessions = [
    {
      title: 'Gentle Prenatal Yoga & Bonding',
      date: '24 Jan',
      time: '10:00 AM',
      attendees: 24,
      color: 'pink' as const,
    },
    {
      title: 'Nutrition for Lactation Trimester',
      date: '27 Jan',
      time: '2:00 PM',
      attendees: 18,
      color: 'green' as const,
    },
    {
      title: 'Managing Postpartum Anxiety',
      date: '02 Feb',
      time: '6:00 PM',
      attendees: 32,
      color: 'purple' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 relative">
      {/* Floating Leaves Background */}
      <FloatingLeaves />

      {/* Dashboard Header */}
      <DashboardHeader userName={userName} showRecovery={showRecovery} />

      {/* Hero Section */}
      <HeroSection />

      {/* Choose Your Support Path */}
      <section className="py-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">
              Choose Your Support Path
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <PricingCard
              title="Essential Sanctuary"
              price="Free"
              features={essentialFeatures}
              buttonText="Start Free"
              delay={0.1}
            />
            <PricingCard
              title="Premium Care"
              price="$29"
              period="/ month"
              features={premiumFeatures}
              buttonText="Get Full Access"
              isPremium={true}
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Our Specialists */}
      <section className="py-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2 font-serif">
                Our Specialists
              </h2>
              <p className="text-gray-600">
                Carefully vetted experts dedicated to your journey
              </p>
            </div>
            <button className="text-purple-600 font-medium hover:text-purple-700 transition-colors flex items-center gap-2">
              View All
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {specialists.map((specialist, index) => (
              <SpecialistCard
                key={index}
                {...specialist}
                delay={0.1 * (index + 1)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Collective Sessions */}
      <section className="py-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-2 font-serif">
              Upcoming Collective Sessions
            </h2>
            <p className="text-gray-600">
              Join group workshops & seminars led by experts
            </p>
          </div>

          <div className="space-y-4 max-w-4xl">
            {upcomingSessions.map((session, index) => (
              <SessionCard
                key={index}
                {...session}
                delay={0.1 * (index + 1)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Spacing */}
      <div className="h-24"></div>
    </div>
  );
}
