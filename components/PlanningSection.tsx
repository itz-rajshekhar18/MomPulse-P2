import Image from 'next/image';

export default function PlanningSection() {
  return (
    <section className="w-full px-6 py-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src="/090236fed93233aaeb6a6c437a3c38723e8f7c2f.jpg"
            alt="Planning for pregnancy and work"
            width={600}
            height={700}
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-teal-900/80 via-teal-800/40 to-transparent flex items-end p-8">
            <h2 className="text-4xl font-bold text-white">
              Planning for work?
            </h2>
          </div>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Planning & Pregnancy: Nurturing New Life
          </h2>
          
          <p className="text-gray-600">
            Use the first trimester to prepare you for the life to come ahead. We provide comprehensive guides and tools to help you plan effectively.
          </p>
          
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="text-purple-600 mt-1">✓</span>
              <span className="text-gray-700">Personalized pregnancy timeline</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-600 mt-1">✓</span>
              <span className="text-gray-700">Weekly development updates</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-600 mt-1">✓</span>
              <span className="text-gray-700">Nutrition and wellness guides</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-600 mt-1">✓</span>
              <span className="text-gray-700">Preparation checklists for each trimester</span>
            </li>
          </ul>
          
          <button className="text-purple-600 font-medium hover:text-purple-700 flex items-center gap-2">
            Learn more about pregnancy planning →
          </button>
        </div>
      </div>
    </section>
  );
}
