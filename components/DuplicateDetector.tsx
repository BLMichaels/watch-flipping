'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { AlertTriangle, X, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface Watch {
  id: string;
  brand: string;
  model: string;
  referenceNumber?: string | null;
  purchasePrice: number;
}

interface DuplicateDetectorProps {
  watches: Watch[];
  onViewWatch: (id: string) => void;
}

export function DuplicateDetector({ watches, onViewWatch }: DuplicateDetectorProps) {
  const [showDuplicates, setShowDuplicates] = useState(false);

  const findDuplicates = () => {
    const duplicates: Array<{ key: string; watches: Watch[] }> = [];
    const seen = new Map<string, Watch[]>();

    watches.forEach((watch) => {
      // Create a key based on brand, model, and reference number
      const key = `${watch.brand?.toLowerCase().trim()}_${watch.model?.toLowerCase().trim()}_${watch.referenceNumber?.toLowerCase().trim() || 'no-ref'}`;
      
      if (!seen.has(key)) {
        seen.set(key, []);
      }
      seen.get(key)!.push(watch);
    });

    // Find groups with more than one watch
    seen.forEach((watchList, key) => {
      if (watchList.length > 1) {
        duplicates.push({ key, watches: watchList });
      }
    });

    return duplicates;
  };

  const duplicates = findDuplicates();

  if (duplicates.length === 0) {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Duplicate Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">No duplicate watches found. All watches are unique.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          Potential Duplicates ({duplicates.length} groups)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {duplicates.map((group, index) => (
            <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-800 mb-2">
                {group.watches[0].brand} {group.watches[0].model}
                {group.watches[0].referenceNumber && ` (Ref: ${group.watches[0].referenceNumber})`}
              </p>
              <div className="space-y-2">
                {group.watches.map((watch) => (
                  <div
                    key={watch.id}
                    className="flex items-center justify-between p-2 bg-white rounded border border-yellow-300"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Purchase Price: ${watch.purchasePrice.toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewWatch(watch.id)}
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

