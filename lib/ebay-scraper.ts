// eBay scraping with dynamic imports to avoid build issues
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
  // Use dynamic imports to avoid bundling issues
  const axios = (await import('axios')).default;
  
  try {
    // Fetch the eBay listing page
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    const html = response.data;
    
    // Simple regex-based extraction (more reliable than cheerio for build)
    const titleMatch = html.match(/<h1[^>]*id="x-item-title-label"[^>]*>([^<]+)<\/h1>/i) ||
                       html.match(/<h1[^>]*class="it-ttl"[^>]*>([^<]+)<\/h1>/i) ||
                       html.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // Extract price
    const priceMatch = html.match(/\$[\d,]+\.?\d*/g);
    const priceStr = priceMatch ? priceMatch[0].replace(/[$,]/g, '') : null;
    const price = priceStr ? parseFloat(priceStr) : null;

    // Extract description
    const descMatch = html.match(/<div[^>]*id="viTabs_0_is"[^>]*>([\s\S]*?)<\/div>/i) ||
                      html.match(/<div[^>]*class="u-flL condText"[^>]*>([\s\S]*?)<\/div>/i);
    const description = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : '';

    // Extract images
    const imageMatches = html.match(/https?:\/\/[^"'\s]+\.(jpg|jpeg|png|webp)/gi) || [];
    const images: string[] = Array.from(new Set(imageMatches)).slice(0, 10) as string[]; // Limit to 10 unique images

    // Extract condition
    const conditionMatch = html.match(/<div[^>]*class="u-flL condText"[^>]*>([^<]+)<\/div>/i) ||
                           html.match(/Condition[^:]*:\s*([^<\n]+)/i);
    const condition = conditionMatch ? conditionMatch[1].trim() : null;

    // Try to extract brand/model from title
    const brandMatch = title.match(/\b(Rolex|Omega|Tag Heuer|Breitling|Seiko|Citizen|Tissot|Hamilton|Longines|IWC|Panerai|Patek|Audemars|Vacheron|Cartier|Tudor|Grand Seiko)\b/i);
    const brand = brandMatch ? brandMatch[1] : undefined;

    // Try to extract reference number (usually 4-6 digits or alphanumeric)
    const refMatch = title.match(/\b([A-Z]{1,3}\d{4,6}[A-Z]?|\d{4,6}[A-Z]{1,3})\b/i);
    const referenceNumber = refMatch ? refMatch[1] : undefined;

    return {
      title: title || 'Untitled Listing',
      description: description || '',
      price,
      images: images.length > 0 ? images : [],
      condition,
      brand,
      model: brand ? title.replace(new RegExp(brand, 'i'), '').trim() : undefined,
      referenceNumber,
    };
  } catch (error: any) {
    console.error('eBay scraping error:', error);
    throw new Error(`Failed to scrape eBay listing: ${error.message}`);
  }
}
