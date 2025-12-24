// eBay scraping temporarily disabled
export interface eBayListingData {
  title: string;
  description: string;
  price: number | null;
  images: string[];
  condition: string | null;
  brand?: string;
  model?: string;
  referenceNumber?: string;
}

export async function scrapeeBayListing(url: string): Promise<eBayListingData> {
  throw new Error('eBay scraping is temporarily disabled. Please use manual entry.');
}

