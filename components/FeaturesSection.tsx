export default function FeaturesSection() {
  const features = [
    {
      icon: '📊',
      title: 'AI Insights',
      description: 'Get personalized insights powered by AI to track your pregnancy journey.',
      color: 'bg-purple-100'
    },
    {
      icon: '🩺',
      title: 'Expert Advice',
      description: 'Access expert medical advice and guidance from certified professionals.',
      color: 'bg-pink-100'
    },
    {
      icon: '💚',
      title: 'Emotional Support',
      description: 'Connect with a supportive community of mothers going through similar experiences.',
      color: 'bg-teal-100'
    },
    {
      icon: '👥',
      title: 'Community',
      description: 'Join thousands of moms sharing their stories, tips, and support.',
      color: 'bg-purple-100'
    }
  ];

  return (
    <section className="w-full px-6 py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">
            Every Step Supported
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-light">
            Comprehensive support throughout your motherhood journey
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 font-serif">{feature.title}</h3>
              <p className="text-gray-600 text-sm font-light">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
