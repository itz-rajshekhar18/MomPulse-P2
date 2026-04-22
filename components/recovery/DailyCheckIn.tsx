'use client';

import { useState, useEffect } from 'react';
import { Moon, Droplet, Zap, Heart, Activity, Thermometer } from 'lucide-react';
import { saveRecoveryLog, getDeliveryInfo, getRecoveryLogs, getUserProfile } from '@/lib/firestore';
import { predictRecoveryScore } from '@/lib/recovery/recoveryModel';
import { classifyRisk } from '@/lib/recovery/riskModel';
import { useAuth } from '@/contexts/AuthContext';

export default function DailyCheckIn() {
  const { user } = useAuth();
  const [sleep, setSleep] = useState(5);
  const [pain, setPain] = useState(4);
  const [bleeding, setBleeding] = useState(2);
  const [energy, setEnergy] = useState(5);
  const [mood, setMood] = useState(6);
  const [steps, setSteps] = useState(1500);
  const [fever, setFever] = useState(false);
  const [loading, setLoading] = useState(false);
  const [daysSinceDelivery, setDaysSinceDelivery] = useState(0);

  useEffect(() => {
    const calculateDays = async () => {
      if (!user) return;
      
      try {
        const deliveryInfo = await getDeliveryInfo(user.uid);
        if (deliveryInfo) {
          const deliveryDate = new Date(deliveryInfo.deliveryDate);
          const today = new Date();
          const days = Math.floor((today.getTime() - deliveryDate.getTime()) / (1000 * 60 * 60 * 24));
          setDaysSinceDelivery(days);
        }
      } catch (error) {
        console.error('Error calculating days:', error);
      }
    };

    calculateDays();
  }, [user]);

  const handleLogToday = async () => {
    if (!user) {
      alert('Please log in to save your check-in');
      return;
    }

    setLoading(true);
    try {
      // Get delivery info
      const deliveryInfo = await getDeliveryInfo(user.uid);
      if (!deliveryInfo) {
        alert('Please set up your delivery information first');
        setLoading(false);
        return;
      }

      // Get user profile for age
      const profile = await getUserProfile(user.uid);
      if (!profile?.age) {
        alert('Age information is required. Please update your profile.');
        setLoading(false);
        return;
      }

      // Calculate days since delivery
      const deliveryDate = new Date(deliveryInfo.deliveryDate);
      const today = new Date();
      const daysSinceDelivery = Math.floor((today.getTime() - deliveryDate.getTime()) / (1000 * 60 * 60 * 24));

      // Get previous logs for ML model
      const previousLogs = await getRecoveryLogs(user.uid);

      // Prepare input data with user's age and first-time mom status
      const inputData = {
        day: daysSinceDelivery,
        deliveryType: deliveryInfo.deliveryType,
        sleep,
        pain,
        bleeding,
        energy,
        activity: steps,
        mood,
        fever,
        age: profile.age,
        firstTimeMom: deliveryInfo.firstTimeMom || false,
      };

      // Calculate recovery score using ML model
      const recoveryScore = predictRecoveryScore(inputData, previousLogs);

      // Classify risk
      const riskAssessment = classifyRisk(inputData, previousLogs);

      // Save to Firestore
      await saveRecoveryLog(user.uid, {
        ...inputData,
        recoveryScore,
        riskLevel: riskAssessment.level,
      });

      alert(`✅ Logged successfully!\n\nRecovery Score: ${recoveryScore}/100\nRisk Level: ${riskAssessment.level.toUpperCase()}`);
      
    } catch (error) {
      console.error('Error logging check-in:', error);
      alert('Failed to log check-in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-sm border border-purple-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 italic">Today's Check-in</h3>
        <span className="text-purple-600 text-sm font-semibold">Day {daysSinceDelivery}</span>
      </div>

      <div className="space-y-6">
        {/* Sleep */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Moon className="w-5 h-5 text-purple-600" />
              <span className="text-gray-900 font-medium">Sleep</span>
              <span className="text-gray-500 text-sm">Total hours slept</span>
            </div>
            <span className="text-gray-900 font-bold">{sleep}hrs</span>
          </div>
          <input
            type="range"
            min="1"
            max="12"
            step="0.5"
            value={sleep}
            onChange={(e) => setSleep(parseFloat(e.target.value))}
            className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer slider-purple"
          />
        </div>

        {/* Pain Level */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">💊</span>
              <span className="text-gray-900 font-medium">Pain Level</span>
              <span className="text-gray-500 text-sm">Overall discomfort</span>
            </div>
            <span className="text-gray-900 font-bold">{pain}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={pain}
            onChange={(e) => setPain(parseInt(e.target.value))}
            className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer slider-pink"
          />
        </div>

        {/* Bleeding */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Droplet className="w-5 h-5 text-pink-600" />
              <span className="text-gray-900 font-medium">Bleeding</span>
              <span className="text-gray-500 text-sm">0 = none, 5 = heavy</span>
            </div>
            <span className="text-gray-900 font-bold">{bleeding}/5</span>
          </div>
          <input
            type="range"
            min="0"
            max="5"
            value={bleeding}
            onChange={(e) => setBleeding(parseInt(e.target.value))}
            className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer slider-pink"
          />
        </div>

        {/* Energy */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-purple-600" />
              <span className="text-gray-900 font-medium">Energy</span>
              <span className="text-gray-500 text-sm">How energized you feel</span>
            </div>
            <span className="text-gray-900 font-bold">{energy}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={energy}
            onChange={(e) => setEnergy(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer slider-purple"
          />
        </div>

        {/* Mood */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-pink-600" />
              <span className="text-gray-900 font-medium">Mood</span>
              <span className="text-gray-500 text-sm">Emotional wellbeing</span>
            </div>
            <span className="text-gray-900 font-bold">{mood}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={mood}
            onChange={(e) => setMood(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer slider-purple"
          />
        </div>

        {/* Steps */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-purple-600" />
              <span className="text-gray-900 font-medium">Steps</span>
              <span className="text-gray-500 text-sm">Movement today</span>
            </div>
            <span className="text-gray-900 font-bold">{steps.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="0"
            max="8000"
            step="100"
            value={steps}
            onChange={(e) => setSteps(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer slider-purple"
          />
        </div>

        {/* Fever */}
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Thermometer className="w-5 h-5 text-pink-600" />
              <span className="text-gray-900 font-medium">Fever present?</span>
            </div>
            <button
              onClick={() => setFever(!fever)}
              className={`w-14 h-8 rounded-full transition-colors relative ${
                fever ? 'bg-pink-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  fever ? 'translate-x-7' : 'translate-x-1'
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>

      {/* Log Button */}
      <button
        onClick={handleLogToday}
        disabled={loading}
        className="w-full mt-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Logging...' : 'Log Today'}
      </button>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider-purple::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #9333ea, #c026d3);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(147, 51, 234, 0.5);
        }

        .slider-purple::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #9333ea, #c026d3);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(147, 51, 234, 0.5);
        }

        .slider-pink::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #f472b6);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(236, 72, 153, 0.5);
        }

        .slider-pink::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #f472b6);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(236, 72, 153, 0.5);
        }

        input[type='range']::-webkit-slider-runnable-track {
          height: 8px;
          border-radius: 4px;
        }

        input[type='range']::-moz-range-track {
          height: 8px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
