import { NextRequest, NextResponse } from 'next/server';
import { savePeriodPrediction } from '@/lib/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, cycles } = body;

    if (!userId || !cycles || cycles.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: userId and cycles' },
        { status: 400 }
      );
    }

    // Prepare data for ML backend (matching Python API format)
    const cycleData = cycles.map((cycle: any) => ({
      start_date: cycle.start_date,
      end_date: cycle.end_date,
      symptoms: cycle.symptoms || [],
      flow_intensity: cycle.flow_intensity || 'medium',
      mood: cycle.mood || null,
      notes: cycle.notes || ''
    }));

    // Send to ML backend for prediction
    const mlBackendUrl = process.env.ML_BACKEND_URL || 'https://mompulse-p2-2.onrender.com';
    
    try {
      const mlResponse = await fetch(`${mlBackendUrl}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cycles: cycleData
        }),
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!mlResponse.ok) {
        console.error('ML backend error:', await mlResponse.text());
        throw new Error('ML backend returned error');
      }

      const prediction = await mlResponse.json();

      // Map Python API response to our format
      const mappedPrediction = {
        nextPeriodDate: prediction.next_period_start,
        nextOvulationDate: prediction.ovulation_date,
        predictedCycleLength: prediction.predicted_cycle_length,
        predictedPeriodLength: prediction.avg_period_duration,
        confidence: mapConfidence(prediction.confidence),
        fertileWindow: {
          start: prediction.fertile_window_start,
          end: prediction.fertile_window_end
        },
        insights: [
          `Cycle regularity: ${prediction.cycle_regularity}`,
          `Average cycle length: ${prediction.avg_cycle_length} days`,
          `Based on ${prediction.data_points} logged cycles`,
          `Confidence level: ${prediction.confidence}`
        ]
      };

      // Save prediction to Firestore
      await savePeriodPrediction(userId, mappedPrediction);

      return NextResponse.json({
        success: true,
        prediction: mappedPrediction,
        mlBackendUsed: true
      });

    } catch (mlError) {
      console.error('ML backend unavailable, using fallback prediction:', mlError);
      
      // Fallback: Calculate simple prediction based on averages
      const fallbackPrediction = calculateFallbackPrediction(cycles);
      
      // Save fallback prediction to Firestore
      await savePeriodPrediction(userId, fallbackPrediction);

      return NextResponse.json({
        success: true,
        prediction: fallbackPrediction,
        mlBackendUsed: false,
        note: 'Using fallback prediction (ML backend unavailable)'
      });
    }

  } catch (error) {
    console.error('Error in period prediction API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Map confidence string to number
function mapConfidence(confidenceStr: string): number {
  switch (confidenceStr) {
    case 'high':
      return 0.85;
    case 'medium':
      return 0.70;
    case 'low':
      return 0.50;
    default:
      return 0.60;
  }
}

// Fallback prediction when ML backend is unavailable
function calculateFallbackPrediction(cycles: any[]): any {
  // Calculate average cycle length
  let totalCycleLength = 0;
  let cycleCount = 0;
  
  for (let i = 1; i < cycles.length; i++) {
    const prevStart = new Date(cycles[i - 1].start_date);
    const currentStart = new Date(cycles[i].start_date);
    const diff = Math.floor((currentStart.getTime() - prevStart.getTime()) / (1000 * 60 * 60 * 24));
    totalCycleLength += diff;
    cycleCount++;
  }
  
  const avgCycleLength = cycleCount > 0 ? Math.round(totalCycleLength / cycleCount) : 28;
  
  // Calculate average period length
  const avgPeriodLength = Math.round(
    cycles.reduce((sum: number, cycle: any) => {
      const start = new Date(cycle.start_date);
      const end = new Date(cycle.end_date);
      return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }, 0) / cycles.length
  );
  
  // Get last cycle start date
  const lastCycle = cycles[cycles.length - 1];
  const lastStart = new Date(lastCycle.start_date);
  
  // Predict next period
  const nextPeriodDate = new Date(lastStart);
  nextPeriodDate.setDate(nextPeriodDate.getDate() + avgCycleLength);
  
  // Predict ovulation (typically 14 days before next period)
  const nextOvulationDate = new Date(nextPeriodDate);
  nextOvulationDate.setDate(nextOvulationDate.getDate() - 14);
  
  // Calculate fertile window (5 days before ovulation to 1 day after)
  const fertileStart = new Date(nextOvulationDate);
  fertileStart.setDate(fertileStart.getDate() - 5);
  
  const fertileEnd = new Date(nextOvulationDate);
  fertileEnd.setDate(fertileEnd.getDate() + 1);
  
  // Calculate regularity
  let regularity = 'unknown';
  if (cycleCount >= 2) {
    const cycleLengths = [];
    for (let i = 1; i < cycles.length; i++) {
      const prevStart = new Date(cycles[i - 1].start_date);
      const currentStart = new Date(cycles[i].start_date);
      cycleLengths.push(Math.floor((currentStart.getTime() - prevStart.getTime()) / (1000 * 60 * 60 * 24)));
    }
    const stdDev = Math.sqrt(cycleLengths.reduce((sum, len) => sum + Math.pow(len - avgCycleLength, 2), 0) / cycleLengths.length);
    
    if (stdDev <= 2) regularity = 'very regular';
    else if (stdDev <= 5) regularity = 'mostly regular';
    else if (stdDev <= 8) regularity = 'somewhat irregular';
    else regularity = 'irregular';
  }
  
  return {
    nextPeriodDate: nextPeriodDate.toISOString().split('T')[0],
    nextOvulationDate: nextOvulationDate.toISOString().split('T')[0],
    predictedCycleLength: avgCycleLength,
    predictedPeriodLength: avgPeriodLength,
    confidence: cycles.length >= 6 ? 0.80 : cycles.length >= 3 ? 0.65 : 0.50,
    fertileWindow: {
      start: fertileStart.toISOString().split('T')[0],
      end: fertileEnd.toISOString().split('T')[0]
    },
    insights: [
      `Cycle regularity: ${regularity}`,
      `Based on ${cycles.length} logged cycle${cycles.length > 1 ? 's' : ''}`,
      `Average cycle length: ${avgCycleLength} days`,
      `Average period length: ${avgPeriodLength} days`
    ]
  };
}
