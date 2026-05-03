'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Resources' },
    { id: 'guides', name: 'Guides' },
    { id: 'support', name: 'Support' },
    { id: 'faq', name: 'FAQ' },
    { id: 'contact', name: 'Contact' }
  ];

  const resources = [
    {
      category: 'guides',
      title: 'Getting Started Guide',
      description: 'Learn how to set up your account and start tracking your cycle',
      icon: '📖',
      link: '#'
    },
    {
      category: 'guides',
      title: 'Period Tracking 101',
      description: 'Complete guide to understanding and tracking your menstrual cycle',
      icon: '📅',
      link: '#'
    },
    {
      category: 'guides',
      title: 'Pregnancy Journey',
      description: 'Week-by-week guide to your pregnancy journey',
      icon: '🤰',
      link: '#'
    },
    {
      category: 'guides',
      title: 'Postpartum Recovery',
      description: 'Essential guide to postpartum care and recovery',
      icon: '👶',
      link: '#'
    },
    {
      category: 'support',
      title: 'Help Center',
      description: 'Browse our comprehensive help articles and tutorials',
      icon: '❓',
      link: '#'
    },
    {
      category: 'support',
      title: 'Video Tutorials',
      description: 'Watch step-by-step video guides for all features',
      icon: '🎥',
      link: '#'
    },
    {
      category: 'support',
      title: 'Community Forum',
      description: 'Connect with other mothers and share experiences',
      icon: '💬',
      link: '/community'
    },
    {
      category: 'support',
      title: 'Expert Consultations',
      description: 'Book appointments with healthcare professionals',
      icon: '👩‍⚕️',
      link: '/consultation'
    }
  ];

  const faqs = [
    {
      question: 'How do I track my period?',
      answer: 'Simply log the start and end dates of your period in the calendar. MomPulse will automatically predict your next cycle and fertile window.'
    },
    {
      question: 'Is my data private and secure?',
      answer: 'Yes! We use bank-level encryption and are HIPAA compliant. Your data is never shared with third parties without your explicit consent.'
    },
    {
      question: 'Can I use MomPulse during pregnancy?',
      answer: 'Absolutely! MomPulse offers comprehensive pregnancy tracking including week-by-week updates, appointment management, and kick counting.'
    },
    {
      question: 'How accurate are the predictions?',
      answer: 'Our AI-powered predictions become more accurate over time as they learn your unique patterns. Most users see 95%+ accuracy after 3 cycles.'
    },
    {
      question: 'Can I share my data with my doctor?',
      answer: 'Yes! You can export your data as a PDF or share it directly with your healthcare provider through the app.'
    },
    {
      question: 'What if I have irregular cycles?',
      answer: 'MomPulse is designed to work with irregular cycles. Our AI adapts to your unique patterns and provides personalized insights.'
    }
  ];

  const contactOptions = [
    {
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      icon: '📧',
      contact: 'support@mompulse.com',
      action: 'Send Email'
    },
    {
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      icon: '💬',
      contact: 'Available 9 AM - 6 PM EST',
      action: 'Start Chat'
    },
    {
      title: 'Phone Support',
      description: 'Speak with a support specialist',
      icon: '📞',
      contact: '+1 (555) 123-4567',
      action: 'Call Now'
    },
    {
      title: 'Help Center',
      description: 'Browse our knowledge base',
      icon: '📚',
      contact: 'Instant answers to common questions',
      action: 'Visit Help Center'
    }
  ];

  const filteredResources = activeCategory === 'all' 
    ? resources 
    : resources.filter(r => r.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between bg-white shadow-sm">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          MomPulse
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/features" className="text-gray-600 hover:text-gray-900">
            Features
          </Link>
          <Link href="/resources" className="text-purple-600 font-medium">
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
            Resources &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Support
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Everything you need to make the most of your MomPulse experience
          </p>
        </motion.div>
      </section>

      {/* Category Filter */}
      <section className="px-6 max-w-7xl mx-auto mb-12">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* Resources Grid */}
      {(activeCategory === 'all' || activeCategory === 'guides' || activeCategory === 'support') && (
        <section className="px-6 py-12 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {activeCategory === 'guides' ? 'Guides & Tutorials' : activeCategory === 'support' ? 'Support Resources' : 'All Resources'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredResources.map((resource, index) => (
              <motion.a
                key={resource.title}
                href={resource.link}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 group"
              >
                <div className="text-4xl mb-4">{resource.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {resource.description}
                </p>
              </motion.a>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {(activeCategory === 'all' || activeCategory === 'faq') && (
        <section className="px-6 py-20 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Contact Section */}
      {(activeCategory === 'all' || activeCategory === 'contact') && (
        <section className="px-6 py-20 bg-gradient-to-r from-purple-100 to-pink-100">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Get in Touch
              </h2>
              <p className="text-xl text-gray-600">
                Our support team is here to help you every step of the way
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactOptions.map((option, index) => (
                <motion.div
                  key={option.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-lg text-center"
                >
                  <div className="text-5xl mb-4">{option.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {option.description}
                  </p>
                  <p className="text-purple-600 font-medium mb-4">
                    {option.contact}
                  </p>
                  <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    {option.action}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of mothers who trust MomPulse
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Get Started Free
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
