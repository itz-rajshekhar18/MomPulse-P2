import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full px-6 py-12 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">MomPulse</h3>
            <p className="text-sm text-gray-600">
              Supporting mothers through every step of their journey.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="#" className="hover:text-gray-900">Pregnancy Tracking</Link></li>
              <li><Link href="#" className="hover:text-gray-900">Expert Advice</Link></li>
              <li><Link href="#" className="hover:text-gray-900">Community</Link></li>
              <li><Link href="#" className="hover:text-gray-900">Resources</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="#" className="hover:text-gray-900">Blog</Link></li>
              <li><Link href="#" className="hover:text-gray-900">Guides</Link></li>
              <li><Link href="#" className="hover:text-gray-900">FAQs</Link></li>
              <li><Link href="#" className="hover:text-gray-900">Support</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="#" className="hover:text-gray-900">Our Story</Link></li>
              <li><Link href="#" className="hover:text-gray-900">Team</Link></li>
              <li><Link href="#" className="hover:text-gray-900">Careers</Link></li>
              <li><Link href="#" className="hover:text-gray-900">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            © 2026 MomPulse. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-600">
            <Link href="#" className="hover:text-gray-900">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-900">Terms of Service</Link>
            <Link href="#" className="hover:text-gray-900">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
