import { NextRequest, NextResponse } from 'next/server';

/**
 * Pregnancy Wellness ML API
 * 
 * Predicts wellness score and risk level based on pregnancy tracking data.
 * Uses a two-headed neural network model:
 * - Risk classifier: 3 classes (Thriving, Moderate Concern, Needs Attention)
 * - Wellness scorer: continuous score 0-100
 * 
 * Input features:
 * - week: pregnancy week (1-40)
 * - energy: energy level (1-10)
 * - sleep: hours of sleep (0-12)
 * - symptom_count: number of symptoms (0-12)
 * - water_pct: hydration percentage (0-100)
 * - diet_pct: diet adherence percentage (0-100)
 * - trimester: current trimester (1-3)
 */

interface PregnancyWellnessInput {
  week: number;
  energy: number;
  sleep: number;
  symptom_count: number;
  water_pct: number;
  diet_pct: number;
  trimester: number;
}

interface PregnancyWellnessOutput {
  wellness_score: number;
  risk_level: string;
  risk_class: number;
  recommendations: string[];
  insights: {
    energy_status: string;
    sleep_status: string;
    hydration_status: string;
    diet_status: string;
    symptom_status: string;
  };
}

// Helper function to determine trimester from week
function getTrimester(week: number): number {
  if (week <= 12) return 1;
  if (week <= 27) return 2;
  return 3;
}

// Rule-based wellness score calculation (matches Python training logic)
function calculateWellnessScore(
  energy: number,
  sleep: number,
  symptoms: number,
  water_pct: number,
  diet_pct: number
): number {
  let score = 50.0;

  // Energy contribution (max ±20)
  score += (energy - 5) * 4.0;

  // Sleep contribution
  if (sleep < 7) {
    score -= (7 - sleep) * 5.0;
  } else if (sleep > 10) {
    score -= (sleep - 10) * 3.0;
  } else {
    score += (sleep - 7) * 2.0;
  }

  // Symptom load (-4 per symptom, capped at 12)
  score -= Math.min(symptoms, 12) * 4.0;

  // Hydration (+10 if fully hydrated)
  score += (water_pct / 100) * 10.0;

  // Diet adherence (+10 if fully adherent)
  score += (diet_pct / 100) * 10.0;

  return Math.max(0, Math.min(100, score));
}

// Determine risk class from wellness score
function getRiskClass(wellness: number): { class: number; label: string } {
  if (wellness >= 68) {
    return { class: 0, label: 'Thriving' };
  } else if (wellness >= 42) {
    return { class: 1, label: 'Moderate Concern' };
  }
  return { class: 2, label: 'Needs Attention' };
}

// Generate personalized recommendations
function generateRecommendations(input: PregnancyWellnessInput, wellness: number): string[] {
  const recommendations: string[] = [];

  // Energy recommendations
  if (input.energy < 5) {
    recommendations.push('Consider light exercise like prenatal yoga to boost energy levels');
    recommendations.push('Ensure you\'re getting adequate iron and B vitamins');
  }

  // Sleep recommendations
  if (input.sleep < 7) {
    recommendations.push('Aim for 7-9 hours of sleep per night for optimal wellness');
    recommendations.push('Try using a pregnancy pillow for better sleep comfort');
  } else if (input.sleep > 10) {
    recommendations.push('Excessive sleep may indicate fatigue - consult your healthcare provider');
  }

  // Symptom recommendations
  if (input.symptom_count > 5) {
    recommendations.push('High symptom count detected - discuss with your doctor');
    recommendations.push('Keep a symptom diary to track patterns and triggers');
  }

  // Hydration recommendations
  if (input.water_pct < 70) {
    recommendations.push('Increase water intake - aim for 8-10 glasses per day');
    recommendations.push('Set reminders to drink water throughout the day');
  }

  // Diet recommendations
  if (input.diet_pct < 70) {
    recommendations.push('Focus on nutrient-dense foods: fruits, vegetables, whole grains');
    recommendations.push('Consider meal planning to maintain consistent healthy eating');
  }

  // Trimester-specific recommendations
  if (input.trimester === 1) {
    recommendations.push('First trimester: Focus on folic acid and managing morning sickness');
  } else if (input.trimester === 2) {
    recommendations.push('Second trimester: Maintain calcium and protein intake for baby\'s growth');
  } else {
    recommendations.push('Third trimester: Stay active and prepare for labor with breathing exercises');
  }

  // Overall wellness recommendations
  if (wellness < 42) {
    recommendations.push('⚠️ Schedule a check-up with your healthcare provider soon');
  } else if (wellness < 68) {
    recommendations.push('Consider consulting with a nutritionist or wellness coach');
  } else {
    recommendations.push('Great job! Keep up your healthy habits');
  }

  return recommendations.slice(0, 5); // Return top 5 recommendations
}

// Generate insights
function generateInsights(input: PregnancyWellnessInput): PregnancyWellnessOutput['insights'] {
  return {
    energy_status: input.energy >= 7 ? 'Good' : input.energy >= 5 ? 'Moderate' : 'Low',
    sleep_status: input.sleep >= 7 && input.sleep <= 9 ? 'Optimal' : input.sleep < 7 ? 'Insufficient' : 'Excessive',
    hydration_status: input.water_pct >= 80 ? 'Excellent' : input.water_pct >= 60 ? 'Good' : 'Needs Improvement',
    diet_status: input.diet_pct >= 80 ? 'Excellent' : input.diet_pct >= 60 ? 'Good' : 'Needs Improvement',
    symptom_status: input.symptom_count <= 2 ? 'Minimal' : input.symptom_count <= 5 ? 'Moderate' : 'High',
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const { week, energy, sleep, symptom_count, water_pct, diet_pct } = body;

    if (
      typeof week !== 'number' ||
      typeof energy !== 'number' ||
      typeof sleep !== 'number' ||
      typeof symptom_count !== 'number' ||
      typeof water_pct !== 'number' ||
      typeof diet_pct !== 'number'
    ) {
      return NextResponse.json(
        { error: 'Invalid input: all fields must be numbers' },
        { status: 400 }
      );
    }

    // Validate ranges
    if (week < 1 || week > 40) {
      return NextResponse.json(
        { error: 'Week must be between 1 and 40' },
        { status: 400 }
      );
    }

    if (energy < 1 || energy > 10) {
      return NextResponse.json(
        { error: 'Energy must be between 1 and 10' },
        { status: 400 }
      );
    }

    if (sleep < 0 || sleep > 12) {
      return NextResponse.json(
        { error: 'Sleep must be between 0 and 12 hours' },
        { status: 400 }
      );
    }

    if (symptom_count < 0 || symptom_count > 12) {
      return NextResponse.json(
        { error: 'Symptom count must be between 0 and 12' },
        { status: 400 }
      );
    }

    if (water_pct < 0 || water_pct > 100) {
      return NextResponse.json(
        { error: 'Water percentage must be between 0 and 100' },
        { status: 400 }
      );
    }

    if (diet_pct < 0 || diet_pct > 100) {
      return NextResponse.json(
        { error: 'Diet percentage must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Calculate trimester
    const trimester = getTrimester(week);

    const input: PregnancyWellnessInput = {
      week,
      energy,
      sleep,
      symptom_count,
      water_pct,
      diet_pct,
      trimester,
    };

    // Calculate wellness score using rule-based model
    const wellness_score = calculateWellnessScore(
      energy,
      sleep,
      symptom_count,
      water_pct,
      diet_pct
    );

    // Determine risk level
    const risk = getRiskClass(wellness_score);

    // Generate recommendations and insights
    const recommendations = generateRecommendations(input, wellness_score);
    const insights = generateInsights(input);

    const output: PregnancyWellnessOutput = {
      wellness_score: Math.round(wellness_score * 10) / 10,
      risk_level: risk.label,
      risk_class: risk.class,
      recommendations,
      insights,
    };

    return NextResponse.json(output);
  } catch (error) {
    console.error('Error in pregnancy wellness prediction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    model: 'Pregnancy Wellness ML',
    version: '1.0',
    features: [
      'week',
      'energy',
      'sleep',
      'symptom_count',
      'water_pct',
      'diet_pct',
      'trimester',
    ],
  });
}
