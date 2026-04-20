import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="w-full px-6 py-4 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          MomPulse
        </Link>
      </div>
      
      <nav className="hidden md:flex items-center gap-8">
        <Link href="#" className="text-gray-600 hover:text-gray-900">
          Features
        </Link>
        <Link href="#" className="text-gray-600 hover:text-gray-900">
          Resources
        </Link>
        <Link href="#" className="text-gray-600 hover:text-gray-900">
          Pricing
        </Link>
        <Link href="#" className="text-gray-600 hover:text-gray-900">
          Community
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        <Link 
          href="/login" 
          className="text-gray-600 hover:text-gray-900 font-medium"
        >
          Login
        </Link>
        <Link 
          href="/signup" 
          className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
}
