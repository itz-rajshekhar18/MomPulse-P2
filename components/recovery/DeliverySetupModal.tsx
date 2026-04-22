'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { saveDeliveryInfo } from '@/lib/firestore';

interface DeliverySetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

export default function DeliverySetupModal({ isOpen, onClose, onSuccess, userId }: DeliverySetupModalProps) {
  const [deliveryType, setDeliveryType] = useState<'vaginal' | 'csection'>('vaginal');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [firstTimeMom, setFirstTimeMom] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deliveryDate) {
      setError('Please enter your delivery date');
      return;
    }

    // Validate date is not in the future
    const selectedDate = new Date(deliveryDate);
    const today = new Date();
    if (selectedDate > today) {
      setError('Delivery date cannot be in the future');
      return;
    }

    // Validate date is within last 12 weeks
    const twelveWeeksAgo = new Date();
    twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);
    if (selectedDate < twelveWeeksAgo) {
      setError('Recovery tracking is available for deliveries within the last 12 weeks');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await saveDeliveryInfo(userId, {
        deliveryType,
        deliveryDate,
        complications: [],
        notes: firstTimeMom ? 'First-time mother' : 'Experienced mother',
      });

      onSuccess();
    } catch (err: any) {
      console.error('Error saving delivery info:', err);
      setError(err.message || 'Failed to save delivery information');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-serif">Recovery Setup</h2>
            <p className="text-sm text-gray-600 mt-1">Tell us about your delivery to personalize your recovery journey</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Delivery Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Type of Delivery <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDeliveryType('vaginal')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  deliveryType === 'vaginal'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">🤱</div>
                <div className="font-semibold text-gray-900">Vaginal Delivery</div>
                <div className="text-xs text-gray-600 mt-1">Natural birth</div>
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType('csection')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  deliveryType === 'csection'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">🏥</div>
                <div className="font-semibold text-gray-900">C-Section</div>
                <div className="text-xs text-gray-600 mt-1">Cesarean delivery</div>
              </button>
            </div>
          </div>

          {/* Delivery Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              Delivery Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">
              This helps us calculate your recovery timeline and provide accurate insights
            </p>
          </div>

          {/* First Time Mom */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Is this your first baby? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFirstTimeMom(true)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  firstTimeMom
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">👶</div>
                <div className="font-semibold text-gray-900">Yes, First Baby</div>
                <div className="text-xs text-gray-600 mt-1">First-time mother</div>
              </button>
              <button
                type="button"
                onClick={() => setFirstTimeMom(false)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  !firstTimeMom
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">👨‍👩‍👧</div>
                <div className="font-semibold text-gray-900">No, Not First</div>
                <div className="text-xs text-gray-600 mt-1">Experienced mother</div>
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">ℹ️</div>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-1">Why we need this information</h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  Our ML-powered recovery model uses your delivery type, date, and experience level to provide personalized recovery predictions, risk assessments, and tailored recommendations for your healing journey.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Start Recovery Tracking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
