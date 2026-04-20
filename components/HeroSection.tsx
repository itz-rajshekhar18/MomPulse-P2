import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="w-full px-6 py-16 md:py-24">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-block">
            <span className="text-sm font-medium text-purple-600 bg-purple-50 px-4 py-2 rounded-full">
              PREGNANCY ESSENTIALS
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold leading-tight font-serif">
            Your motherhood journey,{' '}
            <span className="text-purple-600">beautifully curated.</span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-lg font-light">
            From pregnancy to postpartum, we provide expert guidance and support every step of the way. Join thousands of moms on their journey.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/signup" 
              className="bg-purple-600 text-white px-8 py-4 rounded-full hover:bg-purple-700 transition-colors text-center font-medium"
            >
              Start Your Journey →
            </Link>
            <Link 
              href="#" 
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full hover:border-gray-400 transition-colors text-center font-medium"
            >
              Explore Features
            </Link>
          </div>
        </div>
        
        <div className="relative">
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/083539af180352d45c1d82f9206b540671268f60.jpg"
              alt="Pregnant woman embracing her journey"
              width={600}
              height={600}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
