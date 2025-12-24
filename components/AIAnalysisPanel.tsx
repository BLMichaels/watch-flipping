'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Loader2, Sparkles } from 'lucide-react';

interface AIAnalysisPanelProps {
  watchId: string;
  watchData: {
    title: string;
    description?: string | null;
    purchasePrice: number;
    images: string[];
    conditionNotes?: string | null;
  };
  onAnalysisComplete: (analysis: any) => void;
}

export function AIAnalysisPanel({
  watchId,
  watchData,
  onAnalysisComplete,
}: AIAnalysisPanelProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: watchData.title,
          description: watchData.description,
          price: watchData.purchasePrice,
          images: watchData.images,
          condition: watchData.conditionNotes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze watch');
      }

      const result = await response.json();
      setAnalysis(result);
      onAnalysisComplete(result);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze watch');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            AI Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    analysis.recommendation === 'buy'
                      ? 'bg-green-100 text-green-800'
                      : analysis.recommendation === 'pass'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {analysis.recommendation.toUpperCase()}
                </span>
                {analysis.confidence && (
                  <span className="text-sm text-gray-600">
                    {analysis.confidence}% confidence
                  </span>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Analysis</h4>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {analysis.explanation}
              </p>
            </div>

            {analysis.estimatedMarketValue && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Estimated Market Values</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">As-Is</p>
                    <p className="font-semibold text-gray-900">
                      ${analysis.estimatedMarketValue.asIs?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Cleaned</p>
                    <p className="font-semibold text-gray-900">
                      ${analysis.estimatedMarketValue.cleaned?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Serviced</p>
                    <p className="font-semibold text-gray-900">
                      ${analysis.estimatedMarketValue.serviced?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {analysis.maintenanceCost && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Estimated Maintenance Cost</h4>
                <p className="text-sm text-gray-700">
                  ${analysis.maintenanceCost.toLocaleString()}
                </p>
              </div>
            )}

            {analysis.estimatedROI && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Estimated ROI</h4>
                <p className="text-sm text-gray-700">{analysis.estimatedROI}%</p>
              </div>
            )}

            {analysis.timeToSell && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Estimated Time to Sell</h4>
                <p className="text-sm text-gray-700">{analysis.timeToSell}</p>
              </div>
            )}

            {analysis.potentialIssues && analysis.potentialIssues.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Potential Issues</h4>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {analysis.potentialIssues.map((issue: string, index: number) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.comparableListings && analysis.comparableListings.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Comparable Listings</h4>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {analysis.comparableListings.map((listing: string, index: number) => (
                    <li key={index}>{listing}</li>
                  ))}
                </ul>
              </div>
            )}

            <Button variant="secondary" onClick={() => setAnalysis(null)}>
              Run New Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          AI-Powered "Should I Buy?" Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Get an AI-powered analysis of this watch listing. The system will analyze the condition,
          research comparable listings, assess maintenance costs, and provide a buy/pass recommendation.
        </p>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            {error}
          </div>
        )}
        <Button onClick={handleAnalyze} disabled={isAnalyzing}>
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Analyze Watch
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

