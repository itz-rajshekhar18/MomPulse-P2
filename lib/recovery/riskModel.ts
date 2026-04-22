/**
 * Risk Detection Classification Model
 * Multi-class: low / medium / high
 * Detects: PPD, Infection, Delayed Healing, Severe Fatigue
 */

/**
 * PPD (Postpartum Depression) risk scorer
 */
function scorePPD(input: any, history: any[] = []): number {
  const recent = history.slice(-7);
  const avgMood = recent.length > 0
    ? recent.reduce((s, l) => s + l.mood, 0) / recent.length
    : input.mood;
  const avgSleep = recent.length > 0
    ? recent.reduce((s, l) => s + l.sleep, 0) / recent.length
    : input.sleep;
  const avgEnergy = recent.length > 0
    ? recent.reduce((s, l) => s + l.energy, 0) / recent.length
    : input.energy;

  let risk = 0;
  risk += (10 - avgMood) * 0.40;
  risk += (10 - avgEnergy) * 0.25;
  risk += (8 - avgSleep) < 0 ? 0 : (8 - avgSleep) * 0.20;

  const lowMoodDays = recent.filter(l => l.mood < 4).length;
  if (lowMoodDays >= 4) risk += 2.5;

  return Math.min(10, risk);
}

/**
 * Infection risk scorer
 */
function scoreInfection(input: any, history: any[] = []): number {
  let risk = 0;
  risk += input.fever * 4.0;
  risk += (input.pain > 7 ? (input.pain - 7) * 0.8 : 0);
  risk += (input.bleeding > 3.5 ? (input.bleeding - 3.5) * 1.5 : 0);

  if ((input.day || 0) > 14 && input.bleeding > 3) {
    risk += 3.0;
  }

  if (input.fever && input.pain > 6) risk += 2.5;

  return Math.min(10, risk);
}

/**
 * Healing delay scorer (C-section specific)
 */
function scoreHealingDelay(input: any, history: any[] = []): number {
  let risk = 0;
  if (input.deliveryType !== 'csection') return 0;

  const week = (input.day || 0) / 7;

  if (week > 3 && input.pain > 5) risk += (input.pain - 5) * 1.2;
  if (week > 4 && input.activity < 1000) risk += 2.0;

  const recentScores = history.slice(-5).map(l => l.recoveryScore);
  if (recentScores.length >= 5) {
    const plateau = Math.max(...recentScores) - Math.min(...recentScores);
    if (plateau < 2) risk += 1.5;
  }

  return Math.min(10, risk);
}

/**
 * Severe fatigue scorer
 */
function scoreFatigue(input: any, history: any[] = []): number {
  let risk = 0;
  risk += (10 - input.energy) * 0.4;
  risk += (8 - input.sleep) > 0 ? (8 - input.sleep) * 0.35 : 0;
  risk += (8000 - input.activity) / 8000 * 2.0;

  if (input.energy < 3 && input.sleep < 4 && input.mood < 4) risk += 2.5;

  return Math.min(10, risk);
}

/**
 * Convert score to risk level
 */
function scoreToLevel(score: number): 'low' | 'medium' | 'high' {
  if (score >= 6) return 'high';
  if (score >= 3.5) return 'medium';
  return 'low';
}

/**
 * Rule-based safety triggers
 */
export function checkRuleTriggers(input: any) {
  const triggers: any[] = [];

  if (input.bleeding > 4 && (input.day || 0) > 14) {
    triggers.push({
      type: 'urgent',
      message: 'Heavy bleeding after 2 weeks requires immediate medical attention',
      action: 'Call your healthcare provider now'
    });
  }

  if (input.fever && input.pain > 7) {
    triggers.push({
      type: 'urgent',
      message: 'Fever combined with high pain may indicate infection',
      action: 'Contact your doctor or go to urgent care'
    });
  }

  if (input.pain > 9) {
    triggers.push({
      type: 'urgent',
      message: 'Severe pain level reported — please seek medical evaluation',
      action: 'Contact your healthcare provider'
    });
  }

  return triggers;
}

/**
 * Main risk classification
 */
export function classifyRisk(input: any, history: any[] = []) {
  const ppdScore = scorePPD(input, history);
  const infectionScore = scoreInfection(input, history);
  const healingScore = scoreHealingDelay(input, history);
  const fatigueScore = scoreFatigue(input, history);

  const maxScore = Math.max(ppdScore, infectionScore, healingScore, fatigueScore);
  const overallLevel = scoreToLevel(maxScore);

  const signals = [ppdScore, infectionScore, healingScore, fatigueScore];
  const activeSignals = signals.filter(s => s > 3).length;
  const confidence = Math.min(0.95, 0.60 + activeSignals * 0.12 + (maxScore / 10) * 0.15);

  const scoreMap = { ppd: ppdScore, infection: infectionScore, healing: healingScore, fatigue: fatigueScore };
  const primaryCategory = Object.entries(scoreMap).sort((a, b) => b[1] - a[1])[0][0];

  const ruleTriggers = checkRuleTriggers(input);
  const effectiveLevel = ruleTriggers.length > 0 ? 'high' : overallLevel;

  return {
    level: effectiveLevel,
    confidence: Math.round(confidence * 100),
    scores: {
      ppd: Math.round(ppdScore * 10) / 10,
      infection: Math.round(infectionScore * 10) / 10,
      healing: Math.round(healingScore * 10) / 10,
      fatigue: Math.round(fatigueScore * 10) / 10,
    },
    primaryCategory,
    ruleTriggers,
  };
}
