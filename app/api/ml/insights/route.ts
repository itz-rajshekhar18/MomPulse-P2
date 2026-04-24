import { NextRequest, NextResponse } from 'next/server';

const ML_BACKEND_URL = process.env.ML_BACKEND_URL || 'https://mompulse-p2-2.onrender.com';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cycles } = body;

    if (!cycles || !Array.isArray(cycles)) {
      return NextResponse.json(
        { error: 'Cycles data is required' },
        { status: 400 }
      );
    }

    // Call ML backend
    const response = await fetch(`${ML_BACKEND_URL}/api/insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cycles }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'ML insights failed' },
        { status: response.status }
      );
    }

    const insights = await response.json();
    return NextResponse.json(insights);
  } catch (error) {
    console.error('ML Insights error:', error);
    return NextResponse.json(
      { error: 'Failed to get insights from ML backend' },
      { status: 500 }
    );
  }
}
