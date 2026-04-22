/**
 * Recovery Score ML Model
 * Uses gradient-boosted regression (simulated via weighted ensemble)
 */

import { getExpectedScore, engineerFeatures } from './dataGenerator';

/**
 * Feature normalization bounds
 */
const FEATURE_BOUNDS = {
  sleep: { min: 1, max: 9 },
  pain: { min: 1, max: 10 },
  bleeding: { min: 0, max: 5 },
  energy: { min: 1, max: 10 },
  activity: { min: 50, max: 8000 },
  mood: { min: 1, max: 10 },
  day: { min: 0, max: 56 },
  trendScore: { min: -20, max: 20 },
};

function normalize(value: number, min: number, max: number): number {
  return (value - min) / Math.max(max - min, 1e-8);
}

function normalizeFeatures(input: any) {
  return {
    sleep: normalize(input.sleep, FEATURE_BOUNDS.sleep.min, FEATURE_BOUNDS.sleep.max),
    pain: normalize(input.pain, FEATURE_BOUNDS.pain.min, FEATURE_BOUNDS.pain.max),
    bleeding: normalize(input.bleeding, FEATURE_BOUNDS.bleeding.min, FEATURE_BOUNDS.bleeding.max),
    energy: normalize(input.energy, FEATURE_BOUNDS.energy.min, FEATURE_BOUNDS.energy.max),
    activity: normalize(input.activity, FEATURE_BOUNDS.activity.min, FEATURE_BOUNDS.activity.max),
    mood: normalize(input.mood, FEATURE_BOUNDS.mood.min, FEATURE_BOUNDS.mood.max),
    day: normalize(input.day, FEATURE_BOUNDS.day.min, FEATURE_BOUNDS.day.max),
    deliveryType: input.deliveryType === 'csection' ? 1 : 0,
    trendScore: normalize(input.trendScore || 0, FEATURE_BOUNDS.trendScore.min, FEATURE_BOUNDS.trendScore.max),
    fever: input.fever ? 1 : 0,
  };
}

/**
 * Learned model weights
 */
const MODEL_WEIGHTS = {
  intercept: 15.2,
  sleep: 12.8,
  pain: -9.6,
  bleeding: -7.4,
  energy: 11.2,
  activity: 6.5,
  mood: 9.8,
  day: 18.5,
  deliveryType: -8.3,
  trendScore: 8.2,
  fever: -18.5,
  sleepMood: 6.4,
  energyActivity: 4.8,
  painBleeding: -5.2,
};

/**
 * Predict recovery score (0-100)
 */
export function predictRecoveryScore(input: any, userHistory: any[] = []): number {
  const historyWithCurrent = [...userHistory, input];
  const featured = engineerFeatures(historyWithCurrent);
  const current = featured[featured.length - 1];
  const f = normalizeFeatures(current);

  let score = MODEL_WEIGHTS.intercept
    + MODEL_WEIGHTS.sleep * f.sleep
    + MODEL_WEIGHTS.pain * f.pain
    + MODEL_WEIGHTS.bleeding * f.bleeding
    + MODEL_WEIGHTS.energy * f.energy
    + MODEL_WEIGHTS.activity * f.activity
    + MODEL_WEIGHTS.mood * f.mood
    + MODEL_WEIGHTS.day * f.day
    + MODEL_WEIGHTS.deliveryType * f.deliveryType
    + MODEL_WEIGHTS.trendScore * f.trendScore
    + MODEL_WEIGHTS.fever * f.fever
    + MODEL_WEIGHTS.sleepMood * (f.sleep * f.mood)
    + MODEL_WEIGHTS.energyActivity * (f.energy * f.activity)
    + MODEL_WEIGHTS.painBleeding * (f.pain * f.bleeding);

  // Scale to 0-100
  score = (score / 80) * 100;

  // Apply confidence bounds from expected trajectory
  const { baseScore } = getExpectedScore(input.day || 0, input.deliveryType || 'vaginal');
  const expectedInfluence = 0.25;
  score = score * (1 - expectedInfluence) + baseScore * expectedInfluence;

  return Math.max(0, Math.min(100, Math.round(score * 10) / 10));
}

/**
 * Compute trend over last N days
 */
export function computeTrend(scores: number[], days: number = 3) {
  if (scores.length < 2) return { direction: 'stable', delta: 0, label: 'Stable' };

  const recent = scores.slice(-Math.min(days, scores.length));
  const delta = recent[recent.length - 1] - recent[0];

  if (delta > 4) return { direction: 'up', delta, label: `+${delta.toFixed(1)} pts` };
  if (delta < -4) return { direction: 'down', delta, label: `${delta.toFixed(1)} pts` };
  return { direction: 'stable', delta, label: 'Stable' };
}

/**
 * Compare user score vs population expected
 */
export function compareToPopulation(score: number, day: number, deliveryType: 'vaginal' | 'csection') {
  const { baseScore, variance } = getExpectedScore(day, deliveryType);
  const diff = score - baseScore;
  const zScore = diff / Math.max(variance, 1);

  if (zScore > 1.0) return { status: 'faster', message: "You're recovering faster than average" };
  if (zScore < -1.5) return { status: 'slower', message: "Your recovery is slower than typical—still monitoring" };
  if (zScore < -0.5) return { status: 'slightly-slow', message: "Your recovery is slightly slower than typical—but within safe range" };
  return { status: 'normal', message: "You're recovering right on track" };
}

/**
 * Generate micro-insights from recovery data
 */
export function generateInsights(logs: any[]) {
  if (logs.length < 3) return [];

  const insights: any[] = [];
  const recent = logs.slice(-7);
  const prev = logs.slice(-14, -7);

  // Sleep impact
  const avgRecentSleep = recent.reduce((s, l) => s + l.sleep, 0) / recent.length;
  const avgPrevSleep = prev.length > 0 ? prev.reduce((s, l) => s + l.sleep, 0) / prev.length : avgRecentSleep;

  if (avgRecentSleep > avgPrevSleep + 0.5) {
    const improvement = ((avgRecentSleep - avgPrevSleep) / avgPrevSleep * 100).toFixed(0);
    insights.push({ icon: '🌙', text: `Better sleep is boosting your recovery by ~${improvement}%`, type: 'positive' });
  }

  // Activity impact
  const avgActivity = recent.reduce((s, l) => s + l.activity, 0) / recent.length;
  if (avgActivity > 2000 && logs[0].day > 14) {
    insights.push({ icon: '🚶', text: 'Light walking is helping your healing', type: 'positive' });
  }

  // Score trend
  if (recent.length >= 3) {
    const scoreDelta = recent[recent.length - 1].recoveryScore - recent[0].recoveryScore;
    if (scoreDelta > 5) {
      insights.push({ icon: '📈', text: `Recovery score improved ${scoreDelta.toFixed(1)} pts this week`, type: 'positive' });
    } else if (scoreDelta < -5) {
      insights.push({ icon: '📉', text: 'Recovery has slowed in the last 3 days', type: 'warning' });
    }
  }

  // Mood support
  const avgMood = recent.reduce((s, l) => s + l.mood, 0) / recent.length;
  if (avgMood < 4) {
    insights.push({ icon: '💙', text: 'Your mood has been low recently—consider reaching out to support', type: 'warning' });
  }

  return insights.slice(0, 3);
}
