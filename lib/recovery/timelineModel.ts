/**
 * Personalized Recovery Timeline Model
 * Predicts milestones and compares user vs population
 */

import { getExpectedScore } from './dataGenerator';

/**
 * Standard recovery milestones
 */
export const MILESTONES = {
  vaginal: [
    { day: 1, label: 'Day 1', description: 'Heavy bleeding, significant fatigue normal', expectedScore: 38 },
    { day: 3, label: 'Day 3', description: 'Milk comes in, perineal soreness peaks', expectedScore: 42 },
    { day: 7, label: 'Week 1', description: 'Bleeding lightens, energy begins returning', expectedScore: 52 },
    { day: 14, label: 'Week 2', description: 'Stitches dissolving, mobility improving', expectedScore: 63 },
    { day: 21, label: 'Week 3', description: 'Most discomfort resolved, light activity OK', expectedScore: 72 },
    { day: 42, label: 'Week 6', description: 'Near baseline, full activity clearance', expectedScore: 89 },
  ],
  csection: [
    { day: 1, label: 'Day 1', description: 'Incision pain, restricted mobility', expectedScore: 28 },
    { day: 3, label: 'Day 3', description: 'Gas pain, first steps with support', expectedScore: 33 },
    { day: 7, label: 'Week 1', description: 'Pain reducing, short walks possible', expectedScore: 38 },
    { day: 14, label: 'Week 2', description: 'Staples removed, incision closing', expectedScore: 50 },
    { day: 21, label: 'Week 3', description: 'Driving usually cleared', expectedScore: 61 },
    { day: 42, label: 'Week 6', description: 'Full clearance typical', expectedScore: 82 },
    { day: 56, label: 'Week 8', description: 'Near complete recovery', expectedScore: 88 },
  ],
};

/**
 * Generate personalized timeline with predictions
 */
export function generatePersonalizedTimeline(history: any[], deliveryType: 'vaginal' | 'csection') {
  const milestones = MILESTONES[deliveryType] || MILESTONES.vaginal;
  const currentDay = history.length > 0 ? history[history.length - 1].day : 0;
  const currentScore = history.length > 0 ? history[history.length - 1].recoveryScore : 0;

  return milestones.map(m => {
    const { baseScore } = getExpectedScore(m.day, deliveryType);
    const userScoreAtDay = history.find(l => l.day === m.day)?.recoveryScore;
    const isPast = m.day <= currentDay;
    const isCurrent = Math.abs(m.day - currentDay) <= 3;

    let status = 'upcoming';
    if (isPast) {
      if (userScoreAtDay !== undefined) {
        const diff = userScoreAtDay - m.expectedScore;
        status = diff >= -5 ? 'completed' : 'completed-slow';
      } else {
        status = 'completed';
      }
    }
    if (isCurrent) status = 'current';

    return {
      ...m,
      populationScore: baseScore,
      userScore: userScoreAtDay,
      status,
      delta: userScoreAtDay !== undefined ? userScoreAtDay - m.expectedScore : null,
    };
  });
}
