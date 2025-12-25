'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PriceData {
  date: string;
  purchasePrice: number;
  revenueAsIs: number | null;
  revenueCleaned: number | null;
  revenueServiced: number | null;
}

interface PriceTrackerProps {
  watches: Array<{
    purchaseDate?: string;
    purchasePrice: number;
    revenueAsIs: number | null;
    revenueCleaned: number | null;
    revenueServiced: number | null;
  }>;
}

export function PriceTracker({ watches }: PriceTrackerProps) {
  // Group watches by purchase date and calculate averages
  const priceData = watches
    .filter(w => w.purchaseDate)
    .reduce((acc, watch) => {
      const date = new Date(watch.purchaseDate!).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          prices: [],
          revenues: { asIs: [], cleaned: [], serviced: [] },
        };
      }
      acc[date].prices.push(watch.purchasePrice);
      if (watch.revenueAsIs) acc[date].revenues.asIs.push(watch.revenueAsIs);
      if (watch.revenueCleaned) acc[date].revenues.cleaned.push(watch.revenueCleaned);
      if (watch.revenueServiced) acc[date].revenues.serviced.push(watch.revenueServiced);
      return acc;
    }, {} as Record<string, { date: string; prices: number[]; revenues: { asIs: number[]; cleaned: number[]; serviced: number[] } }>);

  const chartData = Object.values(priceData)
    .map(({ date, prices, revenues }) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      avgPurchasePrice: prices.reduce((a, b) => a + b, 0) / prices.length,
      avgRevenueAsIs: revenues.asIs.length > 0 ? revenues.asIs.reduce((a, b) => a + b, 0) / revenues.asIs.length : null,
      avgRevenueCleaned: revenues.cleaned.length > 0 ? revenues.cleaned.reduce((a, b) => a + b, 0) / revenues.cleaned.length : null,
      avgRevenueServiced: revenues.serviced.length > 0 ? revenues.serviced.reduce((a, b) => a + b, 0) / revenues.serviced.length : null,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-12); // Last 12 data points

  if (chartData.length === 0) {
    return null;
  }

  const latest = chartData[chartData.length - 1];
  const previous = chartData.length > 1 ? chartData[chartData.length - 2] : null;
  const priceTrend = previous ? latest.avgPurchasePrice - previous.avgPurchasePrice : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-gray-600">Avg Purchase Price</p>
              <p className="text-2xl font-bold text-gray-900">
                ${latest.avgPurchasePrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            {previous && (
              <div className="flex items-center gap-1">
                {priceTrend >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
                <span className={`text-sm font-medium ${priceTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {priceTrend >= 0 ? '+' : ''}${priceTrend.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            )}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <RechartsTooltip />
            <Legend />
            <Line type="monotone" dataKey="avgPurchasePrice" stroke="#3b82f6" name="Avg Purchase Price" />
            {latest.avgRevenueAsIs && (
              <Line type="monotone" dataKey="avgRevenueAsIs" stroke="#10b981" name="Avg Revenue (As-Is)" />
            )}
            {latest.avgRevenueCleaned && (
              <Line type="monotone" dataKey="avgRevenueCleaned" stroke="#f59e0b" name="Avg Revenue (Cleaned)" />
            )}
            {latest.avgRevenueServiced && (
              <Line type="monotone" dataKey="avgRevenueServiced" stroke="#8b5cf6" name="Avg Revenue (Serviced)" />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

