'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { TrendingUp, TrendingDown, DollarSign, Clock, BarChart3 } from 'lucide-react';
import { useMemo } from 'react';

interface Watch {
  id: string;
  brand: string;
  model?: string;
  purchasePrice: number;
  purchaseDate?: string;
  revenueServiced?: number | null;
  revenueCleaned?: number | null;
  revenueAsIs?: number | null;
  status: string;
  soldDate?: string | null;
  soldPrice?: number | null;
}

interface WatchAnalyticsProps {
  watches: Watch[];
}

export function WatchAnalytics({ watches }: WatchAnalyticsProps) {
  const analytics = useMemo(() => {
    const sold = watches.filter(w => w.status === 'sold' && w.soldPrice);
    const active = watches.filter(w => w.status !== 'sold');
    
    const totalSold = sold.reduce((sum, w) => sum + (w.soldPrice || 0), 0);
    const totalSoldCost = sold.reduce((sum, w) => sum + w.purchasePrice, 0);
    const realizedProfit = totalSold - totalSoldCost;
    const realizedROI = totalSoldCost > 0 ? (realizedProfit / totalSoldCost) * 100 : 0;

    const activeInvestment = active.reduce((sum, w) => sum + w.purchasePrice, 0);
    const activeProjectedValue = active.reduce((sum, w) => {
      const best = w.revenueServiced || w.revenueCleaned || w.revenueAsIs || 0;
      return sum + best;
    }, 0);
    const activeProjectedProfit = activeProjectedValue - activeInvestment;
    const activeProjectedROI = activeInvestment > 0 ? (activeProjectedProfit / activeInvestment) * 100 : 0;

    // Average days to sell
    const daysToSell = sold
      .filter(w => w.purchaseDate && w.soldDate)
      .map(w => {
        const purchase = new Date(w.purchaseDate!);
        const sold = new Date(w.soldDate!);
        return Math.floor((sold.getTime() - purchase.getTime()) / (1000 * 60 * 60 * 24));
      });
    const avgDaysToSell = daysToSell.length > 0
      ? daysToSell.reduce((sum, days) => sum + days, 0) / daysToSell.length
      : 0;

    // Best performing brand
    const brandPerformance = watches.reduce((acc, w) => {
      const best = w.revenueServiced || w.revenueCleaned || w.revenueAsIs || 0;
      const profit = best - w.purchasePrice;
      if (!acc[w.brand]) {
        acc[w.brand] = { totalProfit: 0, count: 0 };
      }
      acc[w.brand].totalProfit += profit;
      acc[w.brand].count += 1;
      return acc;
    }, {} as Record<string, { totalProfit: number; count: number }>);

    const bestBrand = Object.entries(brandPerformance)
      .map(([brand, data]) => ({
        brand,
        avgProfit: data.totalProfit / data.count,
        count: data.count,
      }))
      .sort((a, b) => b.avgProfit - a.avgProfit)[0];

    // Profit distribution
    const profitRanges = {
      negative: watches.filter(w => {
        const best = w.revenueServiced || w.revenueCleaned || w.revenueAsIs || 0;
        return (best - w.purchasePrice) < 0;
      }).length,
      low: watches.filter(w => {
        const best = w.revenueServiced || w.revenueCleaned || w.revenueAsIs || 0;
        const profit = best - w.purchasePrice;
        return profit >= 0 && profit < 500;
      }).length,
      medium: watches.filter(w => {
        const best = w.revenueServiced || w.revenueCleaned || w.revenueAsIs || 0;
        const profit = best - w.purchasePrice;
        return profit >= 500 && profit < 2000;
      }).length,
      high: watches.filter(w => {
        const best = w.revenueServiced || w.revenueCleaned || w.revenueAsIs || 0;
        const profit = best - w.purchasePrice;
        return profit >= 2000;
      }).length,
    };

    return {
      sold: {
        count: sold.length,
        totalRevenue: totalSold,
        totalCost: totalSoldCost,
        profit: realizedProfit,
        roi: realizedROI,
      },
      active: {
        count: active.length,
        investment: activeInvestment,
        projectedValue: activeProjectedValue,
        projectedProfit: activeProjectedProfit,
        projectedROI: activeProjectedROI,
      },
      avgDaysToSell,
      bestBrand,
      profitRanges,
    };
  }, [watches]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Realized Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Realized Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Watches Sold</span>
              <span className="text-2xl font-bold">{analytics.sold.count}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Revenue</span>
              <span className="text-xl font-semibold">
                ${analytics.sold.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Cost</span>
              <span className="text-xl font-semibold">
                ${analytics.sold.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-gray-600">Realized Profit</span>
              <span className={`text-2xl font-bold ${
                analytics.sold.profit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ${analytics.sold.profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Realized ROI</span>
              <span className={`text-xl font-semibold ${
                analytics.sold.roi >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {analytics.sold.roi.toFixed(1)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projected Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Projected Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Watches</span>
              <span className="text-2xl font-bold">{analytics.active.count}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Investment</span>
              <span className="text-xl font-semibold">
                ${analytics.active.investment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Projected Value</span>
              <span className="text-xl font-semibold">
                ${analytics.active.projectedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-gray-600">Projected Profit</span>
              <span className={`text-2xl font-bold ${
                analytics.active.projectedProfit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ${analytics.active.projectedProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Projected ROI</span>
              <span className={`text-xl font-semibold ${
                analytics.active.projectedROI >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {analytics.active.projectedROI.toFixed(1)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.avgDaysToSell > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Avg Days to Sell
                </span>
                <span className="text-xl font-semibold">
                  {analytics.avgDaysToSell.toFixed(0)} days
                </span>
              </div>
            )}
            {analytics.bestBrand && (
              <div className="pt-2 border-t">
                <p className="text-sm text-gray-600 mb-2">Best Performing Brand</p>
                <div className="flex justify-between items-center">
                  <span className="font-medium">{analytics.bestBrand.brand}</span>
                  <span className="text-lg font-semibold text-green-600">
                    ${analytics.bestBrand.avgProfit.toFixed(0)} avg profit
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {analytics.bestBrand.count} watch{analytics.bestBrand.count !== 1 ? 'es' : ''}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profit Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Profit Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-red-600">Negative Profit</span>
              <span className="font-semibold">{analytics.profitRanges.negative}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full"
                style={{ width: `${(analytics.profitRanges.negative / watches.length) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-yellow-600">Low Profit ($0-$500)</span>
              <span className="font-semibold">{analytics.profitRanges.low}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-600 h-2 rounded-full"
                style={{ width: `${(analytics.profitRanges.low / watches.length) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-600">Medium Profit ($500-$2K)</span>
              <span className="font-semibold">{analytics.profitRanges.medium}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(analytics.profitRanges.medium / watches.length) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-600">High Profit ($2K+)</span>
              <span className="font-semibold">{analytics.profitRanges.high}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${(analytics.profitRanges.high / watches.length) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

