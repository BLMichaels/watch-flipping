'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { TrendingUp, TrendingDown, DollarSign, Package, Percent, Clock } from 'lucide-react';

interface Watch {
  purchasePrice: number;
  revenueServiced?: number | null;
  revenueCleaned?: number | null;
  revenueAsIs?: number | null;
  status: string;
  purchaseDate?: string;
  soldDate?: string;
  soldPrice?: number | null;
}

interface StatsCardsProps {
  watches: Watch[];
}

export function StatsCards({ watches }: StatsCardsProps) {
  if (watches.length === 0) return null;

  const stats = watches.reduce((acc, watch) => {
    const bestRevenue = watch.revenueServiced || watch.revenueCleaned || watch.revenueAsIs || 0;
    const profit = bestRevenue - watch.purchasePrice;
    const roi = watch.purchasePrice > 0 ? (profit / watch.purchasePrice) * 100 : 0;

    acc.totalInvestment += watch.purchasePrice;
    acc.totalProjectedValue += bestRevenue;
    acc.totalProjectedProfit += profit;
    acc.totalROI += roi;
    acc.count++;

    if (watch.status === 'sold' && watch.soldPrice) {
      acc.realizedProfit += watch.soldPrice - watch.purchasePrice;
      acc.soldCount++;
    }

    if (watch.status === 'ready_to_sell') acc.readyToSell++;
    if (watch.status === 'needs_service') acc.needsService++;
    if (watch.status === 'problem_item') acc.problemItems++;

    return acc;
  }, {
    count: 0,
    totalInvestment: 0,
    totalProjectedValue: 0,
    totalProjectedProfit: 0,
    totalROI: 0,
    realizedProfit: 0,
    soldCount: 0,
    readyToSell: 0,
    needsService: 0,
    problemItems: 0,
  });

  const avgROI = stats.count > 0 ? stats.totalROI / stats.count : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Total Investment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-gray-900">
            ${stats.totalInvestment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-gray-500 mt-1">{stats.count} watches</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            {stats.totalProjectedProfit >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            Projected Profit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold ${stats.totalProjectedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${stats.totalProjectedProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-gray-500 mt-1">Avg ROI: {avgROI.toFixed(1)}%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Status Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Ready</span>
              <span className="font-semibold">{stats.readyToSell}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-yellow-600">Needs Service</span>
              <span className="font-semibold">{stats.needsService}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-red-600">Problem</span>
              <span className="font-semibold">{stats.problemItems}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {stats.soldCount > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Realized Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${stats.realizedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${stats.realizedProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-gray-500 mt-1">{stats.soldCount} sold</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

