'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';

interface Watch {
  purchasePrice: number;
  revenueServiced: number | null;
  revenueCleaned: number | null;
  revenueAsIs: number | null;
  serviceCost?: number | null;
  cleaningCost?: number | null;
  otherCosts?: number | null;
  soldPrice?: number | null;
  status: string;
}

interface ProfitAnalysisProps {
  watches: Watch[];
}

export function ProfitAnalysis({ watches }: ProfitAnalysisProps) {
  if (watches.length === 0) return null;

  const analysis = watches.reduce((acc, watch) => {
    const bestRevenue = watch.revenueServiced || watch.revenueCleaned || watch.revenueAsIs || 0;
    const totalCosts = watch.purchasePrice + 
                      (watch.serviceCost || 0) + 
                      (watch.cleaningCost || 0) + 
                      (watch.otherCosts || 0);
    const projectedProfit = bestRevenue - totalCosts;
    const projectedROI = totalCosts > 0 ? (projectedProfit / totalCosts) * 100 : 0;

    if (watch.status === 'sold' && watch.soldPrice) {
      const realizedProfit = watch.soldPrice - totalCosts;
      const realizedROI = totalCosts > 0 ? (realizedProfit / totalCosts) * 100 : 0;
      acc.realizedProfit += realizedProfit;
      acc.realizedROI += realizedROI;
      acc.soldCount++;
    }

    acc.totalInvestment += totalCosts;
    acc.totalProjectedValue += bestRevenue;
    acc.totalProjectedProfit += projectedProfit;
    acc.totalProjectedROI += projectedROI;
    acc.count++;

    // Categorize by profit potential
    if (projectedROI > 50) acc.highROI++;
    else if (projectedROI > 20) acc.mediumROI++;
    else if (projectedROI > 0) acc.lowROI++;
    else acc.negativeROI++;

    return acc;
  }, {
    count: 0,
    soldCount: 0,
    totalInvestment: 0,
    totalProjectedValue: 0,
    totalProjectedProfit: 0,
    totalProjectedROI: 0,
    realizedProfit: 0,
    realizedROI: 0,
    highROI: 0,
    mediumROI: 0,
    lowROI: 0,
    negativeROI: 0,
  });

  const avgProjectedROI = analysis.count > 0 ? analysis.totalProjectedROI / analysis.count : 0;
  const avgRealizedROI = analysis.soldCount > 0 ? analysis.realizedROI / analysis.soldCount : 0;

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
              ${analysis.totalInvestment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{analysis.count} watches</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Projected Profit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {analysis.totalProjectedProfit >= 0 ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )}
            <span className={`text-2xl font-bold ${analysis.totalProjectedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${analysis.totalProjectedProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Avg ROI: {avgProjectedROI.toFixed(1)}%</p>
        </CardContent>
      </Card>

      {analysis.soldCount > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Realized Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {analysis.realizedProfit >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
              <span className={`text-2xl font-bold ${analysis.realizedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${analysis.realizedProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{analysis.soldCount} sold • {avgRealizedROI.toFixed(1)}% ROI</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">ROI Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-green-600">High (&gt;50%)</span>
              <span className="font-semibold">{analysis.highROI}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-600">Medium (20-50%)</span>
              <span className="font-semibold">{analysis.mediumROI}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-yellow-600">Low (0-20%)</span>
              <span className="font-semibold">{analysis.lowROI}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-red-600">Negative</span>
              <span className="font-semibold">{analysis.negativeROI}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

