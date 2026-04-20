import Image from 'next/image';

export default function PostpartumSection() {
  return (
    <section className="w-full px-6 py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 order-2 md:order-1">
          <h2 className="text-3xl md:text-4xl font-bold">
            Postpartum & Beyond: Caring for the Caregiver
          </h2>
          
          <p className="text-gray-600">
            Your journey doesn't end with delivery. We provide ongoing support for your postpartum recovery and beyond, ensuring you have the resources you need.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-purple-600 mt-1">✓</span>
              <div>
                <h4 className="font-semibold text-gray-900">Recovery tracking</h4>
                <p className="text-sm text-gray-600">Monitor your physical and emotional recovery</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-600 mt-1">✓</span>
              <div>
                <h4 className="font-semibold text-gray-900">Mental health support</h4>
                <p className="text-sm text-gray-600">Access resources for postpartum mental wellness</p>
              </div>
            </div>
          </div>
          
          <button className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors">
            Get Started with Postpartum Care
          </button>
        </div>
        
        <div className="relative order-1 md:order-2">
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/ea4cabba381e43e5ba06d28d171a36664a9f8641.jpg"
              alt="Postpartum care and recovery"
              width={600}
              height={700}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
