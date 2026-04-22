'use client';

import { Bell, Settings } from 'lucide-react';
import Link from 'next/link';

interface PostPregnancyHeaderProps {
  userName: string;
}

export default function PostPregnancyHeader({ userName }: PostPregnancyHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              MomPulse
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/dashboard/post-pregnancy" className="text-purple-600 font-medium border-b-2 border-purple-600 pb-1">
                Recovery
              </Link>
              <Link href="/insights" className="text-gray-600 hover:text-purple-600 transition-colors">
                Insights
              </Link>
              <Link href="/consultation" className="text-gray-600 hover:text-purple-600 transition-colors">
                Sessions
              </Link>
              <Link href="/sanctuary" className="text-gray-600 hover:text-purple-600 transition-colors">
                Wellness
              </Link>
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <Link href="/profile" className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
              {userName.charAt(0).toUpperCase()}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
