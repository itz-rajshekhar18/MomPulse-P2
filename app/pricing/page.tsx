'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: "Free",
      price: { monthly: 0, yearly: 0 },
      description: "Perfect for getting started",
      features: [
        "Basic period tracking",
        "Cycle calendar",
        "Symptom logging",
        "Community access",
        "Educational articles",
        "Mobile app access"
      ],
      cta: "Get Started",
      popular: false,
      color: "from-gray-500 to-gray-600"
    },
    {
      name: "Premium",
      price: { monthly: 9.99, yearly: 99 },
      description: "For comprehensive support",
      features: [
        "Everything in Free",
        "AI-powered predictions",
        "Fertility tracking",
        "Pregnancy week-by-week",
        "Postpartum recovery tools",
        "AI Assistant (unlimited)",
        "Expert consultations (2/month)",
        "Priority support",
        "Ad-free experience",
        "Data export"
      ],
      cta: "Start Free Trial",
      popular: true,
      color: "from-purple-600 to-pink-600"
    },
    {
      name: "Family",
      price: { monthly: 14.99, yearly: 149 },
      description: "For you and your partner",
      features: [
        "Everything in Premium",
        "2 Premium accounts",
        "Partner app access",
        "Shared calendar & insights",
        "Expert consultations (5/month)",
        "Personalized meal plans",
        "Fitness programs",
        "Mental health resources",
        "24/7 priority support"
      ],
      cta: "Start Free Trial",
      popular: false,
      color: "from-indigo-600 to-purple-600"
    }
  ];

  const faqs = [
    {
      question: "Can I switch plans anytime?",
      answer: "Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect at the start of your next billing cycle."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes, Premium and Family plans come with a 14-day free trial. No credit card required to start."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay."
    },
    {
      question: "Can I get a refund?",
      answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use bank-level encryption and are HIPAA compliant. Your data is never shared with third parties."
    },
    {
      question: "Do you offer discounts for students or healthcare workers?",
      answer: "Yes! We offer 20% off Premium plans for students and healthcare workers. Contact support with verification."
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
          <Link href="/features" className="text-gray-600 hover:text-gray-900">
            Features
          </Link>
          <Link href="/resources" className="text-gray-600 hover:text-gray-900">
            Resources
          </Link>
          <Link href="/pricing" className="text-purple-600 font-medium">
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
            Simple,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Transparent
            </span>
            {' '}Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Choose the plan that's right for your journey. All plans include a 14-day free trial.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-lg font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-16 h-8 bg-purple-600 rounded-full transition-colors"
            >
              <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${billingCycle === 'yearly' ? 'translate-x-8' : ''}`}></div>
            </button>
            <span className={`text-lg font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
            </span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              Save 17%
            </span>
          </div>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 py-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-white rounded-3xl shadow-xl p-8 ${plan.popular ? 'ring-4 ring-purple-600 scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-gray-900">
                    ${billingCycle === 'monthly' ? plan.price.monthly : Math.floor(plan.price.yearly / 12)}
                  </span>
                  <span className="text-gray-600">/month</span>
                </div>
                {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Billed ${plan.price.yearly} annually
                  </p>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className={`block w-full py-4 rounded-xl font-semibold text-center transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
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

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-6">Still Have Questions?</h2>
          <p className="text-xl mb-8 opacity-90">
            Our support team is here to help you choose the right plan
          </p>
          <Link
            href="/resources"
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Contact Support
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
