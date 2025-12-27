'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from './ui/Button';

interface Watch {
  id: string;
  brand?: string;
  model?: string;
  purchasePrice: number;
  revenueServiced: number | null;
  revenueCleaned: number | null;
  revenueAsIs: number | null;
  images?: string[];
  conditionNotes?: string | null;
  purchaseDate?: string;
}

interface DataQualityWarningsProps {
  watches: Watch[];
  onViewWatch: (id: string) => void;
}

export function DataQualityWarnings({ watches, onViewWatch }: DataQualityWarningsProps) {
  const warnings: Array<{ watch: Watch; issues: string[] }> = [];

  watches.forEach((watch) => {
    const issues: string[] = [];

    // Missing required fields
    if (!watch.brand) issues.push('Missing brand');
    if (!watch.model) issues.push('Missing model');
    if (!watch.purchaseDate) issues.push('Missing purchase date');

    // Missing revenue estimates
    if (!watch.revenueAsIs && !watch.revenueCleaned && !watch.revenueServiced) {
      issues.push('No revenue estimates');
    }

    // Missing images
    if (!watch.images || watch.images.length === 0) {
      issues.push('No images');
    }

    // Missing condition notes
    if (!watch.conditionNotes) {
      issues.push('No condition notes');
    }

    // Suspicious pricing
    if (watch.purchasePrice <= 0) {
      issues.push('Invalid purchase price');
    }

    if (issues.length > 0) {
      warnings.push({ watch, issues });
    }
  });

  if (warnings.length === 0) {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Data Quality
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">All watches have complete data. Great job!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          Data Quality Warnings ({warnings.length} watches)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {warnings.slice(0, 10).map(({ watch, issues }) => (
            <div key={watch.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {watch.brand || 'Unknown'} {watch.model || ''}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {issues.map((issue, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded"
                      >
                        {issue}
                      </span>
                    ))}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewWatch(watch.id)}
                  className="ml-2"
                >
                  Fix
                </Button>
              </div>
            </div>
          ))}
          {warnings.length > 10 && (
            <p className="text-xs text-gray-500 text-center">
              And {warnings.length - 10} more watches with issues
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

