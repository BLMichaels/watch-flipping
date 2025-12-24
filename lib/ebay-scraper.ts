import * as cheerio from 'cheerio';
import axios from 'axios';

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
  try {
    // Fetch the eBay listing page
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const $ = cheerio.load(response.data);
    
    // Extract title
    const title = $('#x-item-title-label').text().trim() || 
                  $('h1[data-testid="x-item-title-label"]').text().trim() ||
                  $('h1.vi-item__title').text().trim() ||
                  '';
    
    // Extract description
    const description = $('#viTabs_0_is').text().trim() ||
                        $('.notranslate').first().text().trim() ||
                        '';
    
    // Extract price
    let price: number | null = null;
    const priceText = $('.notranslate[itemprop="price"]').attr('content') ||
                     $('.notranslate[itemprop="price"]').text().trim() ||
                     $('.u-flL.condText').next().text().trim();
    
    if (priceText) {
      const priceMatch = priceText.replace(/[^0-9.]/g, '');
      price = parseFloat(priceMatch) || null;
    }
    
    // Extract images
    const images: string[] = [];
    $('img[itemprop="image"]').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      if (src && !images.includes(src)) {
        images.push(src);
      }
    });
    
    // Also try alternative image selectors
    $('.img.imgWr2 img, .vi-image-carousel img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      if (src && !images.includes(src) && src.includes('ebay')) {
        images.push(src);
      }
    });
    
    // Extract condition
    const condition = $('.u-flL.condText').text().trim() ||
                     $('[data-testid="x-condition-label"]').text().trim() ||
                     null;
    
    // Try to parse brand/model from title
    const titleUpper = title.toUpperCase();
    const commonBrands = ['ROLEX', 'OMEGA', 'TAG HEUER', 'BREITLING', 'TUDOR', 'SEIKO', 'CITIZEN', 'HAMILTON', 'TISSOT', 'LONGINES'];
    let brand: string | undefined;
    let model: string | undefined;
    
    for (const b of commonBrands) {
      if (titleUpper.includes(b)) {
        brand = b.charAt(0) + b.slice(1).toLowerCase();
        // Try to extract model (usually after brand)
        const brandIndex = titleUpper.indexOf(b);
        const afterBrand = title.substring(brandIndex + b.length).trim();
        const words = afterBrand.split(/\s+/);
        if (words.length > 0) {
          model = words.slice(0, 3).join(' '); // Take first few words as model
        }
        break;
      }
    }
    
    // Try to extract reference number (usually 4-6 digits or alphanumeric)
    const refMatch = title.match(/\b([A-Z]{1,3}?\d{4,6}|\d{4,6}[A-Z]{0,2})\b/);
    const referenceNumber = refMatch ? refMatch[1] : undefined;
    
    return {
      title,
      description,
      price,
      images: images.length > 0 ? images : [],
      condition,
      brand,
      model,
      referenceNumber,
    };
  } catch (error) {
    console.error('Error scraping eBay listing:', error);
    throw new Error('Failed to scrape eBay listing. Please check the URL and try again.');
  }
}

