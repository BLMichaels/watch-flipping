import { NextRequest, NextResponse } from 'next/server';

// Dynamic import to ensure server-side only
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  // Dynamic import of cheerio to avoid build issues
  const { scrapeeBayListing } = await import('@/lib/ebay-scraper');
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

