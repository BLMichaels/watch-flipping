import { NextRequest, NextResponse } from 'next/server';

// Force Node.js runtime and dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  // Temporarily disabled - eBay scraping feature
  return NextResponse.json(
    { 
      error: 'eBay scraping is temporarily disabled. Please use manual entry.',
      title: '',
      description: '',
      price: null,
      images: [],
      condition: null,
    },
    { status: 503 }
  );
}

