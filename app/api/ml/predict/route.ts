import { NextRequest, NextResponse } from 'next/server';

const ML_BACKEND_URL = process.env.ML_BACKEND_URL || 'http://localhost:5050';

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
    const response = await fetch(`${ML_BACKEND_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cycles }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'ML prediction failed' },
        { status: response.status }
      );
    }

    const prediction = await response.json();
    return NextResponse.json(prediction);
  } catch (error) {
    console.error('ML Prediction error:', error);
    return NextResponse.json(
      { error: 'Failed to get prediction from ML backend' },
      { status: 500 }
    );
  }
}
