'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { TrendingUp, TrendingDown, DollarSign, Clock } from 'lucide-react';

interface Watch {
  purchasePrice: number;
  purchaseDate?: string;
  revenueServiced: number | null;
  revenueCleaned: number | null;
  revenueAsIs: number | null;
  status: string;
  soldPrice?: number | null;
  soldDate?: string | null;
}

interface WatchStatsProps {
  watches: Watch[];
}

export function WatchStats({ watches }: WatchStatsProps) {
  if (watches.length === 0) return null;

  const totalInvestment = watches.reduce((sum, w) => sum + w.purchasePrice, 0);
  const totalProjectedValue = watches.reduce((sum, w) => {
    const bestRevenue = w.revenueServiced || w.revenueCleaned || w.revenueAsIs || 0;
    return sum + bestRevenue;
  }, 0);
  const totalProjectedProfit = totalProjectedValue - totalInvestment;
  const avgROI = totalInvestment > 0 ? (totalProjectedProfit / totalInvestment) * 100 : 0;

  const soldWatches = watches.filter(w => w.status === 'sold' && w.soldPrice);
  const totalSoldValue = soldWatches.reduce((sum, w) => sum + (w.soldPrice || 0), 0);
  const totalSoldProfit = totalSoldValue - soldWatches.reduce((sum, w) => sum + w.purchasePrice, 0);
  const avgSoldROI = soldWatches.length > 0 && soldWatches.reduce((sum, w) => sum + w.purchasePrice, 0) > 0
    ? (totalSoldProfit / soldWatches.reduce((sum, w) => sum + w.purchasePrice, 0)) * 100
    : 0;

  const readyToSell = watches.filter(w => w.status === 'ready_to_sell').length;
  const needsService = watches.filter(w => w.status === 'needs_service').length;
  const problemItems = watches.filter(w => w.status === 'problem_item').length;

  // Calculate average days in inventory for sold watches
  const avgDaysInInventory = soldWatches.length > 0
    ? soldWatches.reduce((sum, w) => {
        if (w.purchaseDate && w.soldDate) {
          const purchaseDate = new Date(w.purchaseDate);
          const soldDate = new Date(w.soldDate);
          const days = (soldDate.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24);
          return sum + days;
        }
        return sum;
      }, 0) / soldWatches.length
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Total Investment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-gray-400" />
            <span className="text-2xl font-bold text-gray-900">
              ${totalInvestment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Projected Profit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {totalProjectedProfit >= 0 ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )}
            <span className={`text-2xl font-bold ${totalProjectedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${totalProjectedProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Avg ROI: {avgROI.toFixed(1)}%</p>
        </CardContent>
      </Card>

      {soldWatches.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Realized Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {totalSoldProfit >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
              <span className={`text-2xl font-bold ${totalSoldProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${totalSoldProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {soldWatches.length} sold • {avgSoldROI.toFixed(1)}% ROI
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Ready to Sell</span>
              <span className="font-semibold text-green-600">{readyToSell}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Needs Service</span>
              <span className="font-semibold text-yellow-600">{needsService}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Problem Items</span>
              <span className="font-semibold text-red-600">{problemItems}</span>
            </div>
            {soldWatches.length > 0 && (
              <div className="flex justify-between text-sm pt-1 border-t border-gray-200">
                <span className="text-gray-600">Avg Days to Sell</span>
                <span className="font-semibold text-gray-900">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {Math.round(avgDaysInInventory)}d
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

