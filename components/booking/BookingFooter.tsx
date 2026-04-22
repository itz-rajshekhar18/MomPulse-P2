'use client';

import Link from 'next/link';

export default function BookingFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 px-6 mt-16">
      <div className="max-w-7xl mx-auto">
        {/* Footer Links */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-6">
          <Link
            href="/privacy"
            className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
          >
            Terms
          </Link>
          <Link
            href="/support"
            className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
          >
            Support
          </Link>
          <Link
            href="/about"
            className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
          >
            Our Story
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm">
          © 2024 MomPulse Sanctuary. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
