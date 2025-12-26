import { NextRequest, NextResponse } from 'next/server';
import { scrapeeBayListing } from '@/lib/ebay-scraper';

// Force Node.js runtime and dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || !url.includes('ebay.com')) {
      return NextResponse.json(
        { error: 'Invalid eBay URL' },
        { status: 400 }
      );
    }

    const listingData = await scrapeeBayListing(url);
    
    return NextResponse.json(listingData);
  } catch (error: any) {
    console.error('eBay scraping error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to scrape eBay listing',
        title: '',
        description: '',
        price: null,
        images: [],
        condition: null,
      },
      { status: 500 }
    );
  }
}

