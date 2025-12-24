'use client';

import { Card, CardContent } from './ui/Card';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';

interface Watch {
  purchasePrice: number;
  revenueServiced: number | null;
  revenueCleaned: number | null;
  revenueAsIs: number | null;
  status: string;
}

interface QuickStatsProps {
  watches: Watch[];
}

export function QuickStats({ watches }: QuickStatsProps) {
  const totalWatches = watches.length;
  const totalInvestment = watches.reduce((sum, w) => sum + w.purchasePrice, 0);
  
  const totalProjectedRevenue = watches.reduce((sum, w) => {
    return sum + (w.revenueServiced || w.revenueCleaned || w.revenueAsIs || 0);
  }, 0);
  
  const totalProfit = totalProjectedRevenue - totalInvestment;
  const avgROI = watches.length > 0
    ? watches.reduce((sum, w) => {
        const bestRevenue = w.revenueServiced || w.revenueCleaned || w.revenueAsIs || 0;
        const profit = bestRevenue - w.purchasePrice;
        return sum + (w.purchasePrice > 0 ? (profit / w.purchasePrice) * 100 : 0);
      }, 0) / watches.length
    : 0;

  const profitableCount = watches.filter(w => {
    const best = w.revenueServiced || w.revenueCleaned || w.revenueAsIs || 0;
    return best > w.purchasePrice;
  }).length;

  const readyToSellCount = watches.filter(w => w.status === 'ready_to_sell').length;
  const soldCount = watches.filter(w => w.status === 'sold').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
      <Card>
        <CardContent className="pt-4">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Total Watches</p>
            <p className="text-xl font-bold text-gray-900">{totalWatches}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Total Investment</p>
            <p className="text-xl font-bold text-gray-900">
              ${(totalInvestment / 1000).toFixed(1)}k
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Projected Revenue</p>
            <p className="text-xl font-bold text-green-600">
              ${(totalProjectedRevenue / 1000).toFixed(1)}k
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Projected Profit</p>
            <div className="flex items-center justify-center gap-1">
              {totalProfit >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <p className={`text-xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(totalProfit / 1000).toFixed(1)}k
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Avg ROI</p>
            <div className="flex items-center justify-center gap-1">
              <Percent className="h-4 w-4 text-blue-600" />
              <p className={`text-xl font-bold ${avgROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {avgROI.toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Ready to Sell</p>
            <p className="text-xl font-bold text-green-600">{readyToSellCount}</p>
            <p className="text-xs text-gray-500 mt-1">
              {totalWatches > 0 ? ((readyToSellCount / totalWatches) * 100).toFixed(0) : 0}%
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

