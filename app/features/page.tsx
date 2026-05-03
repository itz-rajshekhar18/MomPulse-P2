'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function FeaturesPage() {
  const features = [
    {
      category: "Period Tracking",
      icon: "📅",
      color: "from-red-500 to-pink-500",
      items: [
        {
          title: "Smart Cycle Prediction",
          description: "AI-powered predictions that learn from your unique cycle patterns"
        },
        {
          title: "Symptom Tracking",
          description: "Log and monitor symptoms, mood, and physical changes throughout your cycle"
        },
        {
          title: "Fertility Window",
          description: "Identify your most fertile days with precision tracking"
        },
        {
          title: "Calendar Integration",
          description: "Sync with your calendar to plan around your cycle"
        }
      ]
    },
    {
      category: "Pre-Pregnancy Planning",
      icon: "💝",
      color: "from-blue-500 to-purple-500",
      items: [
        {
          title: "Ovulation Tracking",
          description: "Maximize your chances of conception with accurate ovulation predictions"
        },
        {
          title: "Health Optimization",
          description: "Personalized tips for preparing your body for pregnancy"
        },
        {
          title: "Partner Coordination",
          description: "Share insights and plan together with your partner"
        },
        {
          title: "Nutrition Guidance",
          description: "Pre-pregnancy nutrition plans and supplement recommendations"
        }
      ]
    },
    {
      category: "Pregnancy Support",
      icon: "🤰",
      color: "from-purple-500 to-pink-500",
      items: [
        {
          title: "Week-by-Week Tracking",
          description: "Detailed information about your baby's development each week"
        },
        {
          title: "Appointment Manager",
          description: "Keep track of all your prenatal appointments and tests"
        },
        {
          title: "Kick Counter",
          description: "Monitor your baby's movements and activity patterns"
        },
        {
          title: "Weight & Health Tracking",
          description: "Track your weight gain and vital health metrics"
        }
      ]
    },
    {
      category: "Postpartum Recovery",
      icon: "👶",
      color: "from-indigo-500 to-purple-500",
      items: [
        {
          title: "Recovery Tracking",
          description: "Monitor your physical and emotional recovery after delivery"
        },
        {
          title: "Baby Care Logs",
          description: "Track feeding, diaper changes, and sleep patterns"
        },
        {
          title: "Mental Health Support",
          description: "Resources and tracking for postpartum mental wellness"
        },
        {
          title: "Milestone Tracking",
          description: "Celebrate and record your baby's developmental milestones"
        }
      ]
    },
    {
      category: "AI Assistant",
      icon: "🤖",
      color: "from-cyan-500 to-blue-500",
      items: [
        {
          title: "24/7 Support",
          description: "Get instant answers to your questions anytime, anywhere"
        },
        {
          title: "Personalized Insights",
          description: "AI-powered recommendations based on your unique journey"
        },
        {
          title: "Symptom Analysis",
          description: "Understand your symptoms and when to seek medical attention"
        },
        {
          title: "Educational Content",
          description: "Access curated articles and videos relevant to your stage"
        }
      ]
    },
    {
      category: "Community & Support",
      icon: "👥",
      color: "from-pink-500 to-rose-500",
      items: [
        {
          title: "Discussion Forums",
          description: "Connect with mothers at similar stages of their journey"
        },
        {
          title: "Expert Consultations",
          description: "Book video consultations with healthcare professionals"
        },
        {
          title: "Support Groups",
          description: "Join moderated groups for specific topics and concerns"
        },
        {
          title: "Resource Library",
          description: "Access articles, videos, and guides from trusted experts"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between bg-white shadow-sm">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          MomPulse
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/features" className="text-purple-600 font-medium">
            Features
          </Link>
          <Link href="/resources" className="text-gray-600 hover:text-gray-900">
            Resources
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
            Pricing
          </Link>
          <Link href="/community" className="text-gray-600 hover:text-gray-900">
            Community
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
            Login
          </Link>
          <Link href="/signup" className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors">
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Everything You Need,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Every Step
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Comprehensive features designed to support you through every stage of your maternal journey
          </p>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-12 max-w-7xl mx-auto">
        <div className="space-y-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className={`text-5xl bg-gradient-to-r ${feature.color} p-4 rounded-2xl`}>
                  {feature.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{feature.category}</h2>
                  <div className={`h-1 w-20 bg-gradient-to-r ${feature.color} rounded-full mt-2`}></div>
                </div>
              </div>

              {/* Feature Items */}
              <div className="grid md:grid-cols-2 gap-6">
                {feature.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: itemIndex * 0.1 }}
                    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of mothers who trust MomPulse for their journey
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Start Your Free Trial
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-6 py-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">© 2024 MomPulse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
