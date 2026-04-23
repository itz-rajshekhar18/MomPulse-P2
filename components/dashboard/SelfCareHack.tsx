'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserCycles } from '@/lib/firestore';
import { Sparkles } from 'lucide-react';

export default function SelfCareHack() {
  const { user } = useAuth();
  const [hack, setHack] = useState({
    title: "Loading...",
    description: "Getting your personalized self-care tip..."
  });

  useEffect(() => {
    const loadSelfCareHack = async () => {
      if (!user) return;

      try {
        const cycles = await getUserCycles(user.uid);
        
        if (cycles.length > 0) {
          const latestCycle = cycles[cycles.length - 1];
          const startDate = new Date(latestCycle.start_date);
          const today = new Date();
          const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          const cycleDay = daysSinceStart % 28 || 1;

          let hackData = { title: "", description: "" };

          // Set self-care hack based on cycle phase
          if (cycleDay >= 1 && cycleDay <= 5) {
            // Menstrual Phase
            const menstrualHacks = [
              {
                title: "Heat therapy is your BFF right now!",
                description: "A heating pad or warm bath can work wonders for cramps. Add some Epsom salts for extra relaxation."
              },
              {
                title: "Iron-rich foods are key this week!",
                description: "Load up on spinach, beans, and lean meats to replenish what your body is losing."
              },
              {
                title: "Gentle movement helps!",
                description: "Light yoga or a slow walk can actually ease cramps and boost your mood. No need to go hard!"
              }
            ];
            hackData = menstrualHacks[Math.floor(Math.random() * menstrualHacks.length)];
          } else if (cycleDay >= 6 && cycleDay <= 13) {
            // Follicular Phase
            const follicularHacks = [
              {
                title: "Your skin might be less oily this week!",
                description: "Keep it simple with a light moisturizer and lots of water to keep that Glow Phase shine going."
              },
              {
                title: "Perfect time for high-intensity workouts!",
                description: "Your energy is peaking, so try that new dance class or go for a run. Your body can handle it!"
              },
              {
                title: "Experiment with new looks!",
                description: "Your confidence is high and your skin is glowing. Perfect time to try that new hairstyle or makeup look."
              }
            ];
            hackData = follicularHacks[Math.floor(Math.random() * follicularHacks.length)];
          } else if (cycleDay >= 14 && cycleDay <= 16) {
            // Ovulation Phase
            const ovulationHacks = [
              {
                title: "You're at peak social energy!",
                description: "Schedule hangouts, presentations, or anything that requires being 'on'. You've got this!"
              },
              {
                title: "Your body loves cardio right now!",
                description: "Go for that run, bike ride, or dance session. Your stamina is at its highest!"
              },
              {
                title: "Hydration is extra important!",
                description: "Drink plenty of water to support your body during this high-energy phase."
              }
            ];
            hackData = ovulationHacks[Math.floor(Math.random() * ovulationHacks.length)];
          } else {
            // Luteal Phase
            const lutealHacks = [
              {
                title: "Magnesium-rich foods are your friend!",
                description: "Dark chocolate, nuts, and bananas can help with mood swings and cravings. Win-win!"
              },
              {
                title: "Gentle stretching before bed helps!",
                description: "Light yoga or stretching can ease bloating and help you sleep better."
              },
              {
                title: "It's okay to say no!",
                description: "Your energy is naturally lower. Prioritize rest and don't overcommit yourself."
              }
            ];
            hackData = lutealHacks[Math.floor(Math.random() * lutealHacks.length)];
          }

          setHack(hackData);
        } else {
          setHack({
            title: "Start tracking your cycle!",
            description: "Log your first cycle to get personalized self-care tips based on your phase."
          });
        }
      } catch (error) {
        console.error('Error loading self-care hack:', error);
        setHack({
          title: "Stay hydrated!",
          description: "Drinking plenty of water is always a good idea for your overall health and wellness."
        });
      }
    };

    loadSelfCareHack();
  }, [user]);

  return (
    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 shadow-sm border border-teal-200">
      <div className="flex items-start space-x-3 mb-3">
        <div className="p-2 bg-teal-100 rounded-lg">
          <Sparkles className="w-5 h-5 text-teal-600" />
        </div>
        <div>
          <p className="text-xs text-teal-600 font-bold uppercase tracking-wide mb-1">
            SPARKLES SELF-CARE HACK
          </p>
          <h3 className="text-base font-bold text-gray-900">
            {hack.title}
          </h3>
        </div>
      </div>
      
      <p className="text-sm text-gray-700 leading-relaxed">
        {hack.description}
      </p>
    </div>
  );
}
