'use client';

import Link from 'next/link';
import { Bell, Download, User } from 'lucide-react';

interface RecoveryHeaderProps {
  userName?: string;
}

export default function RecoveryHeader({ userName }: RecoveryHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/dashboard" className="text-2xl font-bold text-purple-600 font-serif">
            MomPulse
          </Link>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/recovery" 
              className="text-purple-600 font-semibold border-b-2 border-purple-600 pb-1"
            >
              Recovery
            </Link>
            <Link 
              href="/track" 
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              Track
            </Link>
            <Link 
              href="/ai-care" 
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              AI Care
            </Link>
            <Link 
              href="/consultation" 
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              Consults
            </Link>
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors">
            <Download className="w-5 h-5" />
          </button>
          <Link 
            href="/profile"
            className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:shadow-md transition-shadow"
          >
            {userName ? userName.charAt(0).toUpperCase() : 'U'}
          </Link>
        </div>
      </div>
    </header>
  );
}
