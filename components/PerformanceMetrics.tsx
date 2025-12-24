'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { TrendingUp, Clock, DollarSign } from 'lucide-react';

interface Watch {
  purchasePrice: number;
  purchaseDate?: string;
  revenueServiced: number | null;
  revenueCleaned: number | null;
  revenueAsIs: number | null;
  soldDate?: string | null;
  soldPrice?: number | null;
  status: string;
}

interface PerformanceMetricsProps {
  watches: Watch[];
}

export function PerformanceMetrics({ watches }: PerformanceMetricsProps) {
  const soldWatches = watches.filter(w => w.status === 'sold' && w.soldPrice);
  const activeWatches = watches.filter(w => w.status !== 'sold');

  // Calculate average days to sell
  const avgDaysToSell = soldWatches.length > 0
    ? soldWatches.reduce((sum, w) => {
        if (w.purchaseDate && w.soldDate) {
          const purchase = new Date(w.purchaseDate);
          const sold = new Date(w.soldDate);
          const days = (sold.getTime() - purchase.getTime()) / (1000 * 60 * 60 * 24);
          return sum + days;
        }
        return sum;
      }, 0) / soldWatches.length
    : 0;

  // Calculate realized profit
  const realizedProfit = soldWatches.reduce((sum, w) => {
    return sum + ((w.soldPrice || 0) - w.purchasePrice);
  }, 0);

  // Calculate average realized ROI
  const avgRealizedROI = soldWatches.length > 0
    ? soldWatches.reduce((sum, w) => {
        const profit = (w.soldPrice || 0) - w.purchasePrice;
        return sum + (w.purchasePrice > 0 ? (profit / w.purchasePrice) * 100 : 0);
      }, 0) / soldWatches.length
    : 0;

  // Calculate projected vs realized (for watches that are sold)
  const projectedVsRealized = soldWatches.length > 0
    ? soldWatches.reduce((sum, w) => {
        const projected = w.revenueServiced || w.revenueCleaned || w.revenueAsIs || 0;
        const realized = w.soldPrice || 0;
        return sum + (projected > 0 ? ((realized - projected) / projected) * 100 : 0);
      }, 0) / soldWatches.length
    : 0;

  if (soldWatches.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Performance metrics will appear here once you sell your first watch.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <p className="text-sm font-medium text-gray-700">Realized Profit</p>
            </div>
            <p className={`text-2xl font-bold ${realizedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${realizedProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              From {soldWatches.length} sold watch(es)
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <p className="text-sm font-medium text-gray-700">Avg Realized ROI</p>
            </div>
            <p className={`text-2xl font-bold ${avgRealizedROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {avgRealizedROI.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Average return on sold watches
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <p className="text-sm font-medium text-gray-700">Avg Days to Sell</p>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {avgDaysToSell.toFixed(0)}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Average time from purchase to sale
            </p>
          </div>

          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <p className="text-sm font-medium text-gray-700">Projection Accuracy</p>
            </div>
            <p className={`text-2xl font-bold ${projectedVsRealized >= -10 ? 'text-green-600' : 'text-orange-600'}`}>
              {projectedVsRealized >= 0 ? '+' : ''}{projectedVsRealized.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Realized vs projected revenue
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

