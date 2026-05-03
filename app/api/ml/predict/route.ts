import { NextRequest, NextResponse } from 'next/server';

const ML_BACKEND_URL = process.env.ML_BACKEND_URL || 'https://mompulse-p2-2.onrender.com';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cycles } = body;

    if (!cycles || !Array.isArray(cycles) || cycles.length === 0) {
      return NextResponse.json(
        { error: 'Cycles data is required' },
        { status: 400 }
      );
    }

    // Try ML backend first with timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      const response = await fetch(`${ML_BACKEND_URL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cycles }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const prediction = await response.json();
        return NextResponse.json(prediction);
      }
    } catch (mlError) {
      console.warn('ML backend unavailable, using fallback:', mlError);
    }

    // Fallback: Calculate prediction locally
    const fallbackPrediction = calculateFallbackPrediction(cycles);
    return NextResponse.json(fallbackPrediction);

  } catch (error) {
    console.error('ML Prediction error:', error);
    return NextResponse.json(
      { error: 'Failed to get prediction' },
      { status: 500 }
    );
  }
}

// Fallback prediction calculation
function calculateFallbackPrediction(cycles: any[]) {
  // Calculate average cycle length
  let totalCycleLength = 0;
  let cycleCount = 0;
  
  for (let i = 1; i < cycles.length; i++) {
    const prevStart = new Date(cycles[i - 1].start_date);
    const currentStart = new Date(cycles[i].start_date);
    const diff = Math.floor((currentStart.getTime() - prevStart.getTime()) / (1000 * 60 * 60 * 24));
    if (diff > 0 && diff < 60) { // Sanity check
      totalCycleLength += diff;
      cycleCount++;
    }
  }
  
  const avgCycleLength = cycleCount > 0 ? Math.round(totalCycleLength / cycleCount) : 28;
  
  // Calculate average period length
  const avgPeriodLength = Math.round(
    cycles.reduce((sum: number, cycle: any) => {
      const start = new Date(cycle.start_date);
      const end = new Date(cycle.end_date);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return sum + (days > 0 && days < 15 ? days : 5); // Sanity check
    }, 0) / cycles.length
  );
  
  // Get last cycle start date
  const lastCycle = cycles[cycles.length - 1];
  const lastStart = new Date(lastCycle.start_date);
  
  // Predict next period
  const nextPeriodStart = new Date(lastStart);
  nextPeriodStart.setDate(nextPeriodStart.getDate() + avgCycleLength);
  
  const nextPeriodEnd = new Date(nextPeriodStart);
  nextPeriodEnd.setDate(nextPeriodEnd.getDate() + avgPeriodLength - 1);
  
  // Predict ovulation (typically 14 days before next period)
  const ovulationDate = new Date(nextPeriodStart);
  ovulationDate.setDate(ovulationDate.getDate() - 14);
  
  // Calculate fertile window (5 days before ovulation to 1 day after)
  const fertileStart = new Date(ovulationDate);
  fertileStart.setDate(fertileStart.getDate() - 5);
  
  const fertileEnd = new Date(ovulationDate);
  fertileEnd.setDate(fertileEnd.getDate() + 1);
  
  // Calculate regularity
  let regularity = 'unknown';
  if (cycleCount >= 2) {
    const cycleLengths = [];
    for (let i = 1; i < cycles.length; i++) {
      const prevStart = new Date(cycles[i - 1].start_date);
      const currentStart = new Date(cycles[i].start_date);
      const diff = Math.floor((currentStart.getTime() - prevStart.getTime()) / (1000 * 60 * 60 * 24));
      if (diff > 0 && diff < 60) {
        cycleLengths.push(diff);
      }
    }
    
    if (cycleLengths.length > 0) {
      const stdDev = Math.sqrt(
        cycleLengths.reduce((sum, len) => sum + Math.pow(len - avgCycleLength, 2), 0) / cycleLengths.length
      );
      
      if (stdDev <= 2) regularity = 'very regular';
      else if (stdDev <= 5) regularity = 'mostly regular';
      else if (stdDev <= 8) regularity = 'somewhat irregular';
      else regularity = 'irregular';
    }
  }
  
  return {
    next_period_start: nextPeriodStart.toISOString().split('T')[0],
    next_period_end: nextPeriodEnd.toISOString().split('T')[0],
    predicted_cycle_length: avgCycleLength,
    ovulation_date: ovulationDate.toISOString().split('T')[0],
    fertile_window_start: fertileStart.toISOString().split('T')[0],
    fertile_window_end: fertileEnd.toISOString().split('T')[0],
    avg_cycle_length: avgCycleLength,
    avg_period_duration: avgPeriodLength,
    cycle_regularity: regularity,
    confidence: cycles.length >= 6 ? 'high' : cycles.length >= 3 ? 'medium' : 'low',
    data_points: cycles.length,
    cycle_lengths: [],
    period_durations: []
  };
}
