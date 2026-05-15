'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Droplets, Smile, MessageSquare, CheckCircle2 } from 'lucide-react';
import { saveCycleData } from '@/lib/firestore';
import { useAuth } from '@/contexts/AuthContext';

interface MarkPeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function MarkPeriodModal({ isOpen, onClose, onSuccess }: MarkPeriodModalProps) {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [flow, setFlow] = useState<'light' | 'medium' | 'heavy'>('medium');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const symptomOptions = [
    { label: 'Cramps', emoji: '😣' },
    { label: 'Headache', emoji: '🤕' },
    { label: 'Bloating', emoji: '🎈' },
    { label: 'Mood Swings', emoji: '🎭' },
    { label: 'Fatigue', emoji: '😴' },
    { label: 'Back Pain', emoji: '😫' },
    { label: 'Breast Tenderness', emoji: '🎾' },
    { label: 'Acne', emoji: '🧴' },
    { label: 'Food Cravings', emoji: '🍕' },
    { label: 'Nausea', emoji: '🤢' }
  ];

  const toggleSymptom = (symptom: string) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter(s => s !== symptom));
    } else {
      setSymptoms([...symptoms, symptom]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Calculate a default end date if not provided (typically 5 days)
      const finalEndDate = endDate || (() => {
        const d = new Date(startDate);
        d.setDate(d.getDate() + 4);
        return d.toISOString().split('T')[0];
      })();

      await saveCycleData(user.uid, {
        start_date: startDate,
        end_date: finalEndDate,
        flow_intensity: flow,
        symptoms: symptoms,
        notes: notes
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onSuccess?.();
        onClose();
        // Reset form
        setStartDate(new Date().toISOString().split('T')[0]);
        setEndDate('');
        setFlow('medium');
        setSymptoms([]);
        setNotes('');
      }, 2000);
    } catch (error) {
      console.error('Error saving cycle:', error);
      alert('Failed to save period data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden"
          >
            {showSuccess ? (
              <div className="p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 font-serif">Logged & Predicted!</h2>
                <p className="text-gray-600">Your cycle has been updated. Our AI is now refining your future predictions.</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white font-serif">Mark Your Period</h2>
                      <p className="text-purple-100 text-xs">Keep your tracking on point</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                  {/* Date Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        Started On
                      </label>
                      <input
                        type="date"
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-pink-600" />
                        Ended On (Est.)
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Flow Intensity */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      Flow Intensity
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['light', 'medium', 'heavy'] as const).map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setFlow(level)}
                          className={`py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${
                            flow === level
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-50 bg-gray-50 hover:border-gray-200'
                          }`}
                        >
                          <span className="text-2xl">
                            {level === 'light' ? '💧' : level === 'medium' ? '💧💧' : '💧💧💧'}
                          </span>
                          <span className="text-xs font-bold uppercase text-gray-700">{level}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Symptoms Grid */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Smile className="w-4 h-4 text-orange-500" />
                      Symptoms Today
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {symptomOptions.map((opt) => (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => toggleSymptom(opt.label)}
                          className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border ${
                            symptoms.includes(opt.label)
                              ? 'bg-purple-600 border-purple-600 text-white shadow-md'
                              : 'bg-white border-gray-100 text-gray-600 hover:border-purple-200'
                          }`}
                        >
                          <span>{opt.emoji}</span>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-purple-400" />
                      Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any specific vibes or details?"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium resize-none h-24"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:scale-[0.98] ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Saving Data...' : 'Confirm & Mark Period'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
