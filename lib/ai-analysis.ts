import axios from 'axios';

export interface AIAnalysisResult {
  recommendation: 'buy' | 'pass' | 'maybe';
  confidence: number;
  explanation: string;
  estimatedMarketValue: {
    asIs: number;
    cleaned: number;
    serviced: number;
  };
  maintenanceCost: number;
  estimatedROI: number;
  timeToSell: string;
  potentialIssues: string[];
  comparableListings: string[];
}

export async function analyzeWatchWithAI(
  listingData: {
    title: string;
    description: string;
    price: number | null;
    images: string[];
    condition: string | null;
  }
): Promise<AIAnalysisResult> {
  // Try Perplexity first, fallback to Claude
  if (process.env.PERPLEXITY_API_KEY) {
    return analyzeWithPerplexity(listingData);
  } else if (process.env.ANTHROPIC_API_KEY) {
    return analyzeWithClaude(listingData);
  } else {
    // Fallback to mock analysis if no API keys
    return generateMockAnalysis(listingData);
  }
}

async function analyzeWithPerplexity(listingData: {
  title: string;
  description: string;
  price: number | null;
  images: string[];
  condition: string | null;
}): Promise<AIAnalysisResult> {
  const prompt = `Analyze this watch listing for a resale/flipping business:

Title: ${listingData.title}
Description: ${listingData.description}
Listed Price: ${listingData.price ? `$${listingData.price}` : 'Not provided'}
Condition: ${listingData.condition || 'Not specified'}

Please provide:
1. A recommendation: "buy", "pass", or "maybe"
2. Confidence level (0-100)
3. Detailed explanation of your reasoning
4. Estimated market values in three scenarios:
   - As-Is (current condition)
   - After cleaning/polishing
   - After full service
5. Estimated maintenance/repair costs
6. Projected ROI percentage
7. Estimated time to sell (e.g., "2-4 weeks")
8. Potential issues or red flags
9. Comparable listings or market references

Format your response as JSON with this structure:
{
  "recommendation": "buy|pass|maybe",
  "confidence": 85,
  "explanation": "detailed explanation...",
  "estimatedMarketValue": {
    "asIs": 1200,
    "cleaned": 1400,
    "serviced": 1600
  },
  "maintenanceCost": 200,
  "estimatedROI": 25.5,
  "timeToSell": "3-5 weeks",
  "potentialIssues": ["issue1", "issue2"],
  "comparableListings": ["ref1", "ref2"]
}`;

  try {
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are an expert watch dealer and appraiser specializing in luxury timepieces. Provide detailed, accurate analysis in JSON format.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices[0].message.content;
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Could not parse AI response');
  } catch (error) {
    console.error('Perplexity API error:', error);
    return generateMockAnalysis(listingData);
  }
}

async function analyzeWithClaude(listingData: {
  title: string;
  description: string;
  price: number | null;
  images: string[];
  condition: string | null;
}): Promise<AIAnalysisResult> {
  const prompt = `Analyze this watch listing for a resale/flipping business:

Title: ${listingData.title}
Description: ${listingData.description}
Listed Price: ${listingData.price ? `$${listingData.price}` : 'Not provided'}
Condition: ${listingData.condition || 'Not specified'}

Provide a JSON response with: recommendation (buy/pass/maybe), confidence (0-100), explanation, estimatedMarketValue (asIs/cleaned/serviced), maintenanceCost, estimatedROI, timeToSell, potentialIssues (array), comparableListings (array).`;

  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-opus-20240229',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      {
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Could not parse AI response');
  } catch (error) {
    console.error('Claude API error:', error);
    return generateMockAnalysis(listingData);
  }
}

function generateMockAnalysis(listingData: {
  title: string;
  description: string;
  price: number | null;
  images: string[];
  condition: string | null;
}): AIAnalysisResult {
  // Mock analysis for development/testing
  const basePrice = listingData.price || 1000;
  
  return {
    recommendation: basePrice < 2000 ? 'buy' : 'maybe',
    confidence: 75,
    explanation: 'Mock analysis: This appears to be a decent opportunity. The price seems reasonable based on the listing details. Consider having it inspected in person before finalizing the purchase.',
    estimatedMarketValue: {
      asIs: basePrice * 1.2,
      cleaned: basePrice * 1.35,
      serviced: basePrice * 1.5,
    },
    maintenanceCost: basePrice * 0.15,
    estimatedROI: 20,
    timeToSell: '4-6 weeks',
    potentialIssues: ['Condition may vary from photos', 'Service history unknown'],
    comparableListings: ['Similar models listed at $' + (basePrice * 1.1).toFixed(0)],
  };
}

