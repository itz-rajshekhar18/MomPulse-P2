'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserCycles } from '@/lib/firestore';
import { Zap } from 'lucide-react';

export default function TodaysVibe() {
  const { user } = useAuth();
  const [vibe, setVibe] = useState({
    title: "Today's Vibe",
    message: "Loading your personalized vibe..."
  });

  useEffect(() => {
    const loadVibeData = async () => {
      if (!user) return;

      try {
        const cycles = await getUserCycles(user.uid);
        
        if (cycles.length > 0) {
          const latestCycle = cycles[cycles.length - 1];
          const startDate = new Date(latestCycle.start_date);
          const today = new Date();
          const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          const cycleDay = daysSinceStart % 28 || 1;

          let vibeData = {
            title: "Today's Vibe",
            message: ""
          };

          // Set vibe based on cycle phase
          if (cycleDay >= 1 && cycleDay <= 5) {
            // Menstrual Phase
            const menstrualVibes = [
              "Your body is doing some serious behind-the-scenes work. Rest, recharge, and be kind to yourself today.",
              "It's totally okay to take things slow today. Your body is resetting, so embrace the cozy vibes.",
              "Self-care mode activated! Listen to your body and give yourself permission to rest."
            ];
            vibeData.message = menstrualVibes[Math.floor(Math.random() * menstrualVibes.length)];
          } else if (cycleDay >= 6 && cycleDay <= 13) {
            // Follicular Phase
            const follicularVibes = [
              "Your brain is literally on fire today (in a good way)! Tackling that math test or learning a new TikTok dance will feel way easier right now.",
              "You're radiating main character energy today! Perfect time to take on challenges and shine bright.",
              "Energy levels are peaking! This is your time to crush goals and try new things."
            ];
            vibeData.message = follicularVibes[Math.floor(Math.random() * follicularVibes.length)];
          } else if (cycleDay >= 14 && cycleDay <= 16) {
            // Ovulation Phase
            const ovulationVibes = [
              "Peak confidence unlocked! You're at your most social and energetic. Go make some magic happen!",
              "You're literally glowing today! Perfect time for presentations, social events, and being your best self.",
              "Main character energy is at 100%! This is your moment to shine and take center stage."
            ];
            vibeData.message = ovulationVibes[Math.floor(Math.random() * ovulationVibes.length)];
          } else {
            // Luteal Phase
            const lutealVibes = [
              "Feeling cozy and introspective? That's totally normal. Embrace the calm and do what feels good.",
              "Your body is winding down. Perfect time for self-care, journaling, and low-key hangouts.",
              "Energy might be dipping, but that's okay! Focus on comfort and things that make you happy."
            ];
            vibeData.message = lutealVibes[Math.floor(Math.random() * lutealVibes.length)];
          }

          setVibe(vibeData);
        } else {
          // Default vibe when no cycles logged
          setVibe({
            title: "Today's Vibe",
            message: "Start tracking your cycle to get personalized daily vibes and insights!"
          });
        }
      } catch (error) {
        console.error('Error loading vibe data:', error);
        setVibe({
          title: "Today's Vibe",
          message: "You're doing great! Keep being awesome."
        });
      }
    };

    loadVibeData();
  }, [user]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-start space-x-3 mb-3">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Zap className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">{vibe.title}</h3>
      </div>
      
      <p className="text-gray-600 leading-relaxed italic">
        "{vibe.message}"
      </p>
    </div>
  );
}
