'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { TrendingUp, DollarSign, Package, Percent } from 'lucide-react';

interface Watch {
  id: string;
  brand: string;
  purchasePrice: number;
  revenueAsIs: number | null;
  revenueCleaned: number | null;
  revenueServiced: number | null;
  status: string;
  purchaseDate?: string;
}

interface SummaryReportProps {
  watches: Watch[];
}

export function SummaryReport({ watches }: SummaryReportProps) {
  const totalWatches = watches.length;
  const totalPurchaseCost = watches.reduce((sum, w) => sum + w.purchasePrice, 0);
  
  const totalProjectedRevenue = {
    best: watches.reduce((sum, w) => sum + (w.revenueServiced || w.revenueCleaned || w.revenueAsIs || 0), 0),
    medium: watches.reduce((sum, w) => sum + (w.revenueCleaned || w.revenueAsIs || 0), 0),
    basic: watches.reduce((sum, w) => sum + (w.revenueAsIs || 0), 0),
  };
  
  const totalProjectedProfit = totalProjectedRevenue.best - totalPurchaseCost;
  const profitMargin = totalPurchaseCost > 0 ? (totalProjectedProfit / totalPurchaseCost) * 100 : 0;
  
  const readyToSell = watches.filter(w => w.status === 'ready_to_sell').length;
  const needsService = watches.filter(w => w.status === 'needs_service').length;
  const problemItems = watches.filter(w => w.status === 'problem_item').length;
  
  const avgPurchasePrice = totalWatches > 0 ? totalPurchaseCost / totalWatches : 0;
  const avgROI = watches.length > 0 
    ? watches.reduce((sum, w) => {
        const bestRevenue = w.revenueServiced || w.revenueCleaned || w.revenueAsIs || 0;
        const profit = bestRevenue - w.purchasePrice;
        return sum + (w.purchasePrice > 0 ? (profit / w.purchasePrice) * 100 : 0);
      }, 0) / watches.length
    : 0;

  const profitableWatches = watches.filter(w => {
    const best = w.revenueServiced || w.revenueCleaned || w.revenueAsIs || 0;
    return best > w.purchasePrice;
  }).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Portfolio Summary Report</h2>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Investment</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${totalPurchaseCost.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {totalWatches} watches
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Projected Return</p>
                <p className="text-2xl font-bold text-green-600">
                  ${totalProjectedRevenue.best.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Best case scenario
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Projected Profit</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${totalProjectedProfit.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {profitMargin.toFixed(1)}% margin
                </p>
              </div>
              <Percent className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average ROI</p>
                <p className="text-2xl font-bold text-gray-900">
                  {avgROI.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Per watch
                </p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Ready to Sell</p>
              <p className="text-2xl font-bold text-green-600">{readyToSell}</p>
              <p className="text-xs text-gray-500 mt-1">
                {totalWatches > 0 ? ((readyToSell / totalWatches) * 100).toFixed(1) : 0}% of portfolio
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Needs Service</p>
              <p className="text-2xl font-bold text-yellow-600">{needsService}</p>
              <p className="text-xs text-gray-500 mt-1">
                {totalWatches > 0 ? ((needsService / totalWatches) * 100).toFixed(1) : 0}% of portfolio
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Problem Items</p>
              <p className="text-2xl font-bold text-red-600">{problemItems}</p>
              <p className="text-xs text-gray-500 mt-1">
                {totalWatches > 0 ? ((problemItems / totalWatches) * 100).toFixed(1) : 0}% of portfolio
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Scenarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">As-Is Scenario</p>
                <p className="text-sm text-gray-600">Sell without any service or cleaning</p>
              </div>
              <p className="text-xl font-bold text-gray-900">
                ${totalProjectedRevenue.basic.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Cleaned Scenario</p>
                <p className="text-sm text-gray-600">After cleaning and polishing</p>
              </div>
              <p className="text-xl font-bold text-blue-600">
                ${totalProjectedRevenue.medium.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Serviced Scenario</p>
                <p className="text-sm text-gray-600">After full service and maintenance</p>
              </div>
              <p className="text-xl font-bold text-green-600">
                ${totalProjectedRevenue.best.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Profitable Watches</span>
                <span className="font-semibold text-gray-900">
                  {profitableWatches} / {totalWatches}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Purchase Price</span>
                <span className="font-semibold text-gray-900">
                  ${avgPurchasePrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Success Rate</span>
                <span className="font-semibold text-gray-900">
                  {totalWatches > 0 ? ((profitableWatches / totalWatches) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {totalWatches === 0 ? (
                <p className="text-gray-600">Add watches to see insights</p>
              ) : (
                <>
                  {profitMargin > 0 ? (
                    <p className="text-green-700">✓ Portfolio is profitable overall</p>
                  ) : (
                    <p className="text-red-700">⚠ Portfolio shows negative margin - review pricing</p>
                  )}
                  {readyToSell > 0 && (
                    <p className="text-gray-700">
                      {readyToSell} watch{readyToSell !== 1 ? 'es' : ''} ready to list for sale
                    </p>
                  )}
                  {needsService > 0 && (
                    <p className="text-gray-700">
                      {needsService} watch{needsService !== 1 ? 'es' : ''} need service before selling
                    </p>
                  )}
                  {avgROI > 20 && (
                    <p className="text-green-700">✓ Strong average ROI of {avgROI.toFixed(1)}%</p>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

