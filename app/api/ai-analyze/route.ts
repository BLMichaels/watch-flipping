import { NextRequest, NextResponse } from 'next/server';

// Temporarily disabled - AI analysis feature
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'AI analysis is temporarily disabled',
      recommendation: 'maybe',
      confidence: 0,
      explanation: 'AI analysis feature is temporarily disabled. Please use manual entry.',
    },
    { status: 503 }
  );
}

