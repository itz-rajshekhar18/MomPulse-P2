'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Baby, Calendar, BarChart3, Users, BookOpen, Sparkles, Home } from 'lucide-react';

interface PregnancyHeaderProps {
  userName?: string;
}

export default function PregnancyHeader({ userName }: PregnancyHeaderProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/dashboard/pregnancy',
      label: 'Overview',
      icon: Home,
      description: 'Dashboard'
    },
    {
      href: '/dashboard/pregnancy/tracker',
      label: 'Tracker',
      icon: Baby,
      description: 'Daily Tracking'
    },
    {
      href: '/dashboard/pregnancy/diet',
      label: 'Diet Tracker',
      icon: BarChart3,
      description: 'Nutrition'
    },
    {
      href: '/dashboard/pregnancy/sessions',
      label: 'Sessions',
      icon: Calendar,
      description: 'Group Consults'
    },
    {
      href: '/community?section=pregnancy',
      label: 'Community',
      icon: Users,
      description: 'Connect & Share'
    },
    {
      href: '/sanctuary',
      label: 'Resources',
      icon: BookOpen,
      description: 'Learn & Explore'
    },
    {
      href: '/ai-assistant',
      label: 'AI Assistant',
      icon: Sparkles,
      description: 'Chat with AI',
      highlight: true
    }
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Top Row */}
        <div className="flex items-center justify-between mb-4">
          <Link href="/dashboard" className="text-2xl font-bold text-purple-600 font-serif">
            MomPulse
          </Link>
          
          <div className="flex items-center gap-4">
            {/* Greeting */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full">
              <span className="text-sm text-gray-600">Hey,</span>
              <span className="text-sm font-semibold text-purple-600">{userName || 'Mom'}</span>
              <span className="text-sm">🤰</span>
            </div>

            {/* Notification */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* Profile */}
            <Link 
              href="/profile"
              className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:shadow-md transition-shadow"
            >
              {userName ? userName.charAt(0).toUpperCase() : 'M'}
            </Link>
          </div>
        </div>

        {/* Navigation Row - Desktop */}
        <nav className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                  item.highlight
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                    : isActive
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Navigation Row - Mobile */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  item.highlight
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : isActive
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </header>
  );
}
