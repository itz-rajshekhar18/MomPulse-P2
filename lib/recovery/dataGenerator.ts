/**
 * Synthetic Data Generator for Postpartum Recovery ML Model
 * Generates realistic recovery trajectories for training
 */

// Normal recovery curves by delivery type and week
const RECOVERY_CURVES = {
  csection: [
    { week: 0, baseScore: 28, variance: 8 },
    { week: 1, baseScore: 38, variance: 10 },
    { week: 2, baseScore: 50, variance: 9 },
    { week: 3, baseScore: 61, variance: 8 },
    { week: 4, baseScore: 70, variance: 7 },
    { week: 5, baseScore: 76, variance: 6 },
    { week: 6, baseScore: 82, variance: 5 },
    { week: 8, baseScore: 88, variance: 4 },
  ],
  vaginal: [
    { week: 0, baseScore: 38, variance: 10 },
    { week: 1, baseScore: 52, variance: 9 },
    { week: 2, baseScore: 63, variance: 8 },
    { week: 3, baseScore: 72, variance: 6 },
    { week: 4, baseScore: 78, variance: 5 },
    { week: 5, baseScore: 84, variance: 5 },
    { week: 6, baseScore: 89, variance: 4 },
    { week: 8, baseScore: 93, variance: 3 },
  ]
};

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/**
 * Generate expected recovery score for a given day post-delivery
 */
export function getExpectedScore(dayPostDelivery: number, deliveryType: 'vaginal' | 'csection' = 'vaginal') {
  const week = dayPostDelivery / 7;
  const curve = RECOVERY_CURVES[deliveryType];

  // Find surrounding weeks
  let lower = curve[0];
  let upper = curve[curve.length - 1];

  for (let i = 0; i < curve.length - 1; i++) {
    if (week >= curve[i].week && week <= curve[i + 1].week) {
      lower = curve[i];
      upper = curve[i + 1];
      break;
    }
  }

  const t = (week - lower.week) / Math.max(upper.week - lower.week, 0.1);
  const baseScore = lerp(lower.baseScore, upper.baseScore, clamp(t, 0, 1));
  const variance = lerp(lower.variance, upper.variance, clamp(t, 0, 1));

  return { baseScore, variance };
}

/**
 * Feature engineering: rolling statistics
 */
export function engineerFeatures(logs: any[]) {
  return logs.map((log, i) => {
    const window = logs.slice(Math.max(0, i - 3), i + 1);
    const avgSleep = window.reduce((s, l) => s + l.sleep, 0) / window.length;
    const avgMood = window.reduce((s, l) => s + l.mood, 0) / window.length;
    const avgEnergy = window.reduce((s, l) => s + l.energy, 0) / window.length;
    const trendScore = i >= 3 ? log.recoveryScore - logs[i - 3].recoveryScore : 0;

    return {
      ...log,
      avgSleep,
      avgMood,
      avgEnergy,
      trendScore,
      scoreVelocity: i > 0 ? log.recoveryScore - logs[i - 1].recoveryScore : 0,
    };
  });
}
