import { NextRequest, NextResponse } from 'next/server';
import { analyzeWatchWithAI } from '@/lib/ai-analysis';

export async function POST(request: NextRequest) {
  try {
    const listingData = await request.json();
    
    const analysis = await analyzeWatchWithAI(listingData);
    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error('Error analyzing watch:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze watch' },
      { status: 500 }
    );
  }
}

