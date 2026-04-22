import { NextRequest, NextResponse } from 'next/server';
import { getUserCycles, saveCycleData } from '@/lib/firestore';

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    const cycles = await getUserCycles(userId);
    
    // Format cycles for ML backend
    const formattedCycles = cycles.map(cycle => ({
      id: cycle.id,
      start_date: cycle.start_date,
      end_date: cycle.end_date,
      symptoms: cycle.symptoms,
      flow_intensity: cycle.flow_intensity,
      notes: cycle.notes,
    }));

    return NextResponse.json({ cycles: formattedCycles });
  } catch (error) {
    console.error('Get cycles error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cycles' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { start_date, end_date, symptoms, flow_intensity, notes } = body;

    if (!start_date || !end_date) {
      return NextResponse.json(
        { error: 'start_date and end_date are required' },
        { status: 400 }
      );
    }

    const cycleId = await saveCycleData(userId, {
      start_date,
      end_date,
      symptoms: symptoms || [],
      flow_intensity: flow_intensity || 'medium',
      notes: notes || '',
    });

    return NextResponse.json({
      message: 'Cycle saved successfully',
      cycleId,
    });
  } catch (error) {
    console.error('Save cycle error:', error);
    return NextResponse.json(
      { error: 'Failed to save cycle' },
      { status: 500 }
    );
  }
}
