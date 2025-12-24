'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface Watch {
  purchaseDate?: string;
  purchasePrice: number;
  revenueServiced: number | null;
  revenueCleaned: number | null;
  revenueAsIs: number | null;
}

interface ValueTrendsProps {
  watches: Watch[];
}

export function ValueTrends({ watches }: ValueTrendsProps) {
  // Group watches by month
  const monthlyData = watches.reduce((acc, watch) => {
    if (!watch.purchaseDate) return acc;
    
    const date = new Date(watch.purchaseDate);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthKey,
        purchaseCost: 0,
        projectedValue: 0,
        count: 0,
      };
    }
    
    acc[monthKey].purchaseCost += watch.purchasePrice;
    acc[monthKey].projectedValue += watch.revenueServiced || watch.revenueCleaned || watch.revenueAsIs || 0;
    acc[monthKey].count += 1;
    
    return acc;
  }, {} as Record<string, { month: string; purchaseCost: number; projectedValue: number; count: number }>);

  const chartData = Object.values(monthlyData)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((item) => ({
      month: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      'Purchase Cost': item.purchaseCost,
      'Projected Value': item.projectedValue,
      'Profit': item.projectedValue - item.purchaseCost,
    }));

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <CardTitle>Value Trends Over Time</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="Purchase Cost" 
              stroke="#8884d8" 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="Projected Value" 
              stroke="#00C49F" 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="Profit" 
              stroke="#FF8042" 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

