'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { X } from 'lucide-react';

interface Watch {
  id: string;
  brand: string;
  model: string;
  purchasePrice: number;
  revenueServiced: number | null;
  revenueCleaned: number | null;
  revenueAsIs: number | null;
  status: string;
}

interface WatchComparisonProps {
  watches: Watch[];
  onClose: () => void;
}

export function WatchComparison({ watches, onClose }: WatchComparisonProps) {
  if (watches.length === 0) return null;

  const getBestProfit = (watch: Watch) => {
    const bestRevenue = watch.revenueServiced || watch.revenueCleaned || watch.revenueAsIs || 0;
    return bestRevenue - watch.purchasePrice;
  };

  const getROI = (watch: Watch) => {
    const bestRevenue = watch.revenueServiced || watch.revenueCleaned || watch.revenueAsIs || 0;
    const profit = bestRevenue - watch.purchasePrice;
    return watch.purchasePrice > 0 ? (profit / watch.purchasePrice) * 100 : 0;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-6xl w-full max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Compare Watches ({watches.length})</CardTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Brand</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Model</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Purchase</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Best Revenue</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Profit</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">ROI</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {watches.map((watch) => (
                  <tr key={watch.id} className="border-b border-gray-100">
                    <td className="py-2 px-3">{watch.brand}</td>
                    <td className="py-2 px-3">{watch.model}</td>
                    <td className="py-2 px-3">${watch.purchasePrice.toLocaleString()}</td>
                    <td className="py-2 px-3">
                      ${(watch.revenueServiced || watch.revenueCleaned || watch.revenueAsIs || 0).toLocaleString()}
                    </td>
                    <td className="py-2 px-3">
                      <span className={`font-semibold ${getBestProfit(watch) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${getBestProfit(watch).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`font-semibold ${getROI(watch) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {getROI(watch).toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        watch.status === 'ready_to_sell' ? 'bg-green-100 text-green-800' :
                        watch.status === 'needs_service' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {watch.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

