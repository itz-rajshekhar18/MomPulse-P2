'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function NewsletterBanner() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription
    console.log('Subscribe:', email);
    setEmail('');
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 rounded-3xl p-8 md:p-12 text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-2xl">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-4 font-serif"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          Weekly Rituals in Your Inbox
        </motion.h2>
        
        <motion.p
          className="text-white/90 text-lg mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Join 50,000+ mothers who receive our curated wellness rituals, recipes, and expert advice every Sunday morning.
        </motion.p>

        <motion.form
          onSubmit={handleSubscribe}
          className="flex gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
          <motion.button
            type="submit"
            className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Subscribe
          </motion.button>
        </motion.form>
      </div>
    </motion.div>
  );
}
