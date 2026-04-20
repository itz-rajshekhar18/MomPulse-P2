import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="w-full px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready for a more supportive journey?
          </h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of mothers who trust MomPulse for their pregnancy and postpartum journey. Start your free trial today.
          </p>
          <Link 
            href="/signup" 
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full hover:bg-gray-100 transition-colors font-medium"
          >
            Get Started for Free
          </Link>
        </div>
      </div>
    </section>
  );
}
