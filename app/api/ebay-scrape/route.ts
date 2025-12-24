import { NextRequest, NextResponse } from 'next/server';
import { scrapeeBayListing } from '@/lib/ebay-scraper';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url || !url.includes('ebay.com')) {
      return NextResponse.json(
        { error: 'Invalid eBay URL' },
        { status: 400 }
      );
    }
    
    const listingData = await scrapeeBayListing(url);
    return NextResponse.json(listingData);
  } catch (error: any) {
    console.error('Error scraping eBay:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to scrape eBay listing' },
      { status: 500 }
    );
  }
}

