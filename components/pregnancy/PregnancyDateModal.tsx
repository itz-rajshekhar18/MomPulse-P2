'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Baby, Loader2, Info } from 'lucide-react';
import { savePregnancyInfo } from '@/lib/firestore';

interface PregnancyDateModalProps {
  isOpen: boolean;
  userId: string;
  onSuccess: () => void;
}

export default function PregnancyDateModal({ isOpen, userId, onSuccess }: PregnancyDateModalProps) {
  const [method, setMethod] = useState<'lmp' | 'dueDate'>('lmp');
  const [date, setDate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      setError('Please select a date to continue.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let finalDueDate = '';
      let finalLMP = '';

      if (method === 'dueDate') {
        finalDueDate = date;
        // Estimate LMP: 280 days before due date
        const due = new Date(date);
        const lmp = new Date(due.getTime() - 280 * 24 * 60 * 60 * 1000);
        finalLMP = lmp.toISOString().split('T')[0];
      } else {
        finalLMP = date;
        // Estimate Due Date: 280 days after LMP
        const lmp = new Date(date);
        const due = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
        finalDueDate = due.toISOString().split('T')[0];
      }

      // Calculate current week
      const now = new Date();
      const lmpDate = new Date(finalLMP);
      const diffTime = Math.abs(now.getTime() - lmpDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const currentWeek = Math.floor(diffDays / 7);

      // Ensure week is within normal bounds
      const validWeek = Math.max(0, Math.min(42, currentWeek));

      await savePregnancyInfo(userId, {
        dueDate: finalDueDate,
        lastMenstrualPeriod: finalLMP,
        currentWeek: validWeek,
      });

      onSuccess();
    } catch (err) {
      console.error('Error saving pregnancy info:', err);
      setError('Failed to save your information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 px-6 py-8 text-center text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl -ml-12 -mb-12" />
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Baby className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold font-serif mb-2">Welcome to your journey!</h2>
            <p className="text-purple-100 text-sm">
              Let's customize your sanctuary by setting up your pregnancy timeline.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              How would you like to calculate your timeline?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMethod('lmp')}
                className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  method === 'lmp'
                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                    : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                First day of last period
              </button>
              <button
                type="button"
                onClick={() => setMethod('dueDate')}
                className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  method === 'dueDate'
                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                    : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                I know my due date
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-500" />
              {method === 'lmp' ? 'First Day of Last Period' : 'Estimated Due Date'}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setError(null);
              }}
              max={method === 'lmp' ? new Date().toISOString().split('T')[0] : undefined}
              min={method === 'dueDate' ? new Date().toISOString().split('T')[0] : undefined}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
            {method === 'lmp' && (
              <p className="mt-2 text-xs text-gray-500 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                We'll use this to calculate your estimated due date.
              </p>
            )}
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100">
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading || !date}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              'Start My Journey'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
