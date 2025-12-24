'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, DollarSign, Package, Percent, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { ExportButton } from './ExportButton';
import { ProfitCalculator } from './ProfitCalculator';
import { WatchReminders } from './WatchReminders';
import { PerformanceMetrics } from './PerformanceMetrics';
import { QuickActions } from './QuickActions';
import { Tooltip } from './Tooltip';
import { RecentActivity } from './RecentActivity';

interface Watch {
  id: string;
  brand: string;
  model?: string;
  purchasePrice: number;
  purchaseDate?: string;
  revenueAsIs: number | null;
  revenueCleaned: number | null;
  revenueServiced: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardProps {
  watches: Watch[];
  onAddWatch: () => void;
  onViewInventory: () => void;
  onExport?: () => void;
}

export function Dashboard({ watches, onAddWatch, onViewInventory, onExport }: DashboardProps) {
  const [metrics, setMetrics] = useState({
    totalPurchaseCost: 0,
    totalProjectedRevenue: { best: 0, medium: 0, basic: 0 },
    totalProjectedProfit: 0,
    profitMargin: 0,
    averageROI: 0,
    readyToSell: 0,
    needsService: 0,
  });

  useEffect(() => {
    const totalPurchaseCost = watches.reduce((sum, w) => sum + w.purchasePrice, 0);
    
    const totalProjectedRevenue = {
      best: watches.reduce((sum, w) => sum + (w.revenueServiced || w.revenueCleaned || w.revenueAsIs || 0), 0),
      medium: watches.reduce((sum, w) => sum + (w.revenueCleaned || w.revenueAsIs || 0), 0),
      basic: watches.reduce((sum, w) => sum + (w.revenueAsIs || 0), 0),
    };
    
    const totalProjectedProfit = totalProjectedRevenue.best - totalPurchaseCost;
    const profitMargin = totalPurchaseCost > 0 ? (totalProjectedProfit / totalPurchaseCost) * 100 : 0;
    const averageROI = watches.length > 0 
      ? watches.reduce((sum, w) => {
          const bestRevenue = w.revenueServiced || w.revenueCleaned || w.revenueAsIs || 0;
          const profit = bestRevenue - w.purchasePrice;
          return sum + (profit / w.purchasePrice) * 100;
        }, 0) / watches.length
      : 0;
    
    const readyToSell = watches.filter(w => w.status === 'ready_to_sell').length;
    const needsService = watches.filter(w => w.status === 'needs_service').length;
    
    setMetrics({
      totalPurchaseCost,
      totalProjectedRevenue,
      totalProjectedProfit,
      profitMargin,
      averageROI,
      readyToSell,
      needsService,
    });
  }, [watches]);

  // Brand distribution for pie chart
  const brandData = watches.reduce((acc, watch) => {
    acc[watch.brand] = (acc[watch.brand] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Profit by brand
  const profitByBrand = watches.reduce((acc, watch) => {
    const bestRevenue = watch.revenueServiced || watch.revenueCleaned || watch.revenueAsIs || 0;
    const profit = bestRevenue - watch.purchasePrice;
    acc[watch.brand] = (acc[watch.brand] || 0) + profit;
    return acc;
  }, {} as Record<string, number>);

  const profitByBrandData = Object.entries(profitByBrand)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 brands

  const pieData = Object.entries(brandData).map(([name, value]: [string, number]) => ({
    name,
    value,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Revenue scenario data
  const revenueData = [
    { scenario: 'As-Is', revenue: metrics.totalProjectedRevenue.basic },
    { scenario: 'Cleaned', revenue: metrics.totalProjectedRevenue.medium },
    { scenario: 'Serviced', revenue: metrics.totalProjectedRevenue.best },
  ];

  // Cumulative profit projection (simplified)
  const profitData = watches.map((watch: Watch, index: number) => {
    const bestRevenue = watch.revenueServiced || watch.revenueCleaned || watch.revenueAsIs || 0;
    const profit = bestRevenue - watch.purchasePrice;
    const cumulative = watches.slice(0, index + 1).reduce((sum, w) => {
      const rev = w.revenueServiced || w.revenueCleaned || w.revenueAsIs || 0;
      return sum + (rev - w.purchasePrice);
    }, 0);
    return {
      watch: `Watch ${index + 1}`,
      profit: cumulative,
    };
  });

  const statusPercentage = watches.length > 0
    ? (metrics.readyToSell / watches.length) * 100
    : 0;

  // Calculate additional stats
  const totalWatches = watches.length;
  const watchesWithRevenue = watches.filter(w => 
    w.revenueAsIs || w.revenueCleaned || w.revenueServiced
  ).length;
  const avgPurchasePrice = totalWatches > 0
    ? watches.reduce((sum, w) => sum + w.purchasePrice, 0) / totalWatches
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Watch Flipping Dashboard</h1>
          <p className="text-gray-600">Track your portfolio performance and inventory</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 flex gap-4 items-center flex-wrap">
          <Button onClick={onAddWatch} size="lg">
            Add New Watch
          </Button>
          <Button onClick={onViewInventory} variant="secondary" size="lg">
            View Inventory
          </Button>
          <ExportButton watches={watches} />
        </div>

        {/* Summary Alert */}
        {watches.length === 0 && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-lg font-semibold text-blue-900 mb-2">Get Started</p>
                <p className="text-blue-700 mb-4">
                  You don't have any watches yet. Add your first watch to start tracking your portfolio!
                </p>
                <Button onClick={onAddWatch}>
                  Add Your First Watch
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Purchase Cost</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${metrics.totalPurchaseCost.toLocaleString()}
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
                  <p className="text-sm text-gray-600 mb-1">Projected Revenue (Best)</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${metrics.totalProjectedRevenue.best.toLocaleString()}
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
                    ${metrics.totalProjectedProfit.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {metrics.profitMargin.toFixed(1)}% margin
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
                    {metrics.averageROI.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {watches.length} watches
                  </p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Watches</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalWatches}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {watchesWithRevenue} with revenue data
                  </p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Average Purchase Price</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${avgPurchasePrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Per watch
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
                  <p className="text-sm text-gray-600 mb-1">Portfolio Health</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.profitMargin > 0 ? '✓ Profitable' : '⚠ Review'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {metrics.profitMargin > 0 ? 'Positive margin' : 'Negative margin'}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry: { name: string; value: number }, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Potential by Scenario</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="scenario" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Bar dataKey="revenue" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Reminders */}
        <WatchReminders watches={watches} />

        {/* Performance Metrics */}
        <PerformanceMetrics watches={watches} />

        {/* Profit Calculator */}
        <div className="mb-6">
          <ProfitCalculator />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Cumulative Profit Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={profitData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="watch" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Line type="monotone" dataKey="profit" stroke="#00C49F" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profit by Brand (Top 5)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={profitByBrandData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Bar dataKey="value" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Portfolio Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Ready to Sell</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {statusPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-green-600 h-4 rounded-full flex items-center justify-center"
                      style={{ width: `${statusPercentage}%` }}
                    >
                      {statusPercentage > 10 && (
                        <span className="text-xs text-white font-medium">
                          {metrics.readyToSell}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Ready: {metrics.readyToSell}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span>Needs Service: {metrics.needsService}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

