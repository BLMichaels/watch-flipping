'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { X, GitCompare } from 'lucide-react';

interface Watch {
  id: string;
  brand: string;
  model: string;
  purchasePrice: number;
  revenueServiced: number | null;
  revenueCleaned: number | null;
  revenueAsIs: number | null;
}

interface QuickCompareProps {
  watches: Watch[];
  onClose: () => void;
}

export function QuickCompare({ watches, onClose }: QuickCompareProps) {
  if (watches.length < 2) return null;

  const getBestProfit = (watch: Watch) => {
    const bestRevenue = watch.revenueServiced || watch.revenueCleaned || watch.revenueAsIs || 0;
    return bestRevenue - watch.purchasePrice;
  };

  const getROI = (watch: Watch) => {
    const profit = getBestProfit(watch);
    return watch.purchasePrice > 0 ? (profit / watch.purchasePrice) * 100 : 0;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-6xl w-full max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <GitCompare className="h-5 w-5" />
              Quick Comparison ({watches.length} watches)
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Watch</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Purchase Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Best Revenue</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Profit</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">ROI %</th>
                </tr>
              </thead>
              <tbody>
                {watches.map((watch) => {
                  const profit = getBestProfit(watch);
                  const roi = getROI(watch);
                  const bestRevenue = watch.revenueServiced || watch.revenueCleaned || watch.revenueAsIs || 0;
                  
                  return (
                    <tr key={watch.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">
                          {watch.brand} {watch.model}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        ${watch.purchasePrice.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        ${bestRevenue.toLocaleString()}
                      </td>
                      <td className={`py-3 px-4 font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                      <td className={`py-3 px-4 font-semibold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {roi.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

