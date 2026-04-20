export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "MomPulse helped me navigate my first pregnancy with confidence. The expert advice and community support were invaluable.",
      author: "Sarah Johnson",
      role: "First-time Mom",
      avatar: "👩"
    },
    {
      quote: "The personalized insights and tracking features made it so easy to stay on top of my pregnancy milestones. Highly recommend!",
      author: "Emily Chen",
      role: "Mom of Two",
      avatar: "👩‍🦱"
    },
    {
      quote: "I loved the postpartum support. It's rare to find a platform that cares about mothers beyond delivery. Thank you MomPulse!",
      author: "Maria Garcia",
      role: "New Mom",
      avatar: "👩‍🦰"
    }
  ];

  return (
    <section className="w-full px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Heartfelt Stories
          </h2>
          <p className="text-gray-600">
            Real experiences from mothers in our community
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-gray-700 mb-6 italic">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
