import { NextRequest, NextResponse } from 'next/server';
import { analyzeWatchWithAI } from '@/lib/ai-analysis';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listingData } = body;

    if (!listingData) {
      return NextResponse.json(
        { error: 'Missing listing data' },
        { status: 400 }
      );
    }

    const analysis = await analyzeWatchWithAI(listingData);
    
    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error('AI analysis error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to analyze watch',
        recommendation: 'maybe',
        confidence: 0,
        explanation: 'AI analysis failed. Please try again or use manual entry.',
      },
      { status: 500 }
    );
  }
}

