import { NextRequest, NextResponse } from 'next/server';
import { deleteCycleData, updateCycleData, getCycleById } from '@/lib/firestore';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ cycleId: string }> }
) {
  try {
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    const { cycleId } = await params;
    const cycle = await getCycleById(userId, cycleId);

    if (!cycle) {
      return NextResponse.json(
        { error: 'Cycle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ cycle });
  } catch (error) {
    console.error('Get cycle error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cycle' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ cycleId: string }> }
) {
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
    const { cycleId } = await params;

    await updateCycleData(userId, cycleId, {
      start_date,
      end_date,
      symptoms,
      flow_intensity,
      notes,
    });

    return NextResponse.json({
      message: 'Cycle updated successfully',
    });
  } catch (error) {
    console.error('Update cycle error:', error);
    return NextResponse.json(
      { error: 'Failed to update cycle' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ cycleId: string }> }
) {
  try {
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    const { cycleId } = await params;
    await deleteCycleData(userId, cycleId);

    return NextResponse.json({
      message: 'Cycle deleted successfully',
    });
  } catch (error) {
    console.error('Delete cycle error:', error);
    return NextResponse.json(
      { error: 'Failed to delete cycle' },
      { status: 500 }
    );
  }
}
