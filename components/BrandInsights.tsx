'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { TrendingUp, DollarSign, Package } from 'lucide-react';

interface Watch {
  brand: string;
  purchasePrice: number;
  revenueServiced: number | null;
  revenueCleaned: number | null;
  revenueAsIs: number | null;
}

interface BrandInsightsProps {
  watches: Watch[];
}

export function BrandInsights({ watches }: BrandInsightsProps) {
  // Calculate insights by brand
  const brandStats = watches.reduce((acc, watch) => {
    if (!acc[watch.brand]) {
      acc[watch.brand] = {
        count: 0,
        totalInvestment: 0,
        totalProjectedValue: 0,
        totalProfit: 0,
      };
    }

    acc[watch.brand].count += 1;
    acc[watch.brand].totalInvestment += watch.purchasePrice;
    const bestRevenue = watch.revenueServiced || watch.revenueCleaned || watch.revenueAsIs || 0;
    acc[watch.brand].totalProjectedValue += bestRevenue;
    acc[watch.brand].totalProfit += bestRevenue - watch.purchasePrice;

    return acc;
  }, {} as Record<string, { count: number; totalInvestment: number; totalProjectedValue: number; totalProfit: number }>);

  const brandData = Object.entries(brandStats)
    .map(([brand, stats]) => ({
      brand,
      ...stats,
      avgROI: stats.totalInvestment > 0 ? (stats.totalProfit / stats.totalInvestment) * 100 : 0,
      avgProfit: stats.count > 0 ? stats.totalProfit / stats.count : 0,
    }))
    .sort((a, b) => b.totalProfit - a.totalProfit)
    .slice(0, 5); // Top 5 brands

  if (brandData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Brands</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {brandData.map((brand) => (
            <div key={brand.brand} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg text-gray-900">{brand.brand}</h3>
                <span className="text-sm text-gray-600">{brand.count} watch(es)</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Total Profit</p>
                  <p className={`text-sm font-bold ${brand.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${brand.totalProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Avg ROI</p>
                  <p className={`text-sm font-bold ${brand.avgROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {brand.avgROI.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Avg Profit/Watch</p>
                  <p className={`text-sm font-bold ${brand.avgProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${brand.avgProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

