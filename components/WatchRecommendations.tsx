'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { TrendingUp, DollarSign, Clock } from 'lucide-react';
import { Button } from './ui/Button';

interface Watch {
  id: string;
  brand?: string;
  model?: string;
  purchasePrice: number;
  revenueServiced: number | null;
  revenueCleaned: number | null;
  revenueAsIs: number | null;
  status: string;
  purchaseDate?: string;
}

interface WatchRecommendationsProps {
  watches: Watch[];
  onViewWatch: (id: string) => void;
}

export function WatchRecommendations({ watches, onViewWatch }: WatchRecommendationsProps) {
  const recommendations: Array<{ watch: Watch; reason: string; priority: 'high' | 'medium' | 'low' }> = [];

  watches.forEach((watch) => {
    const bestRevenue = watch.revenueServiced || watch.revenueCleaned || watch.revenueAsIs || 0;
    const totalCost = watch.purchasePrice;
    const profit = bestRevenue - totalCost;
    const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;

    // High ROI watches that are ready to sell
    if (watch.status === 'ready_to_sell' && roi > 30) {
      recommendations.push({
        watch,
        reason: `High ROI opportunity (${roi.toFixed(1)}%) - Ready to sell`,
        priority: 'high',
      });
    }

    // Watches that need service but have high potential
    if (watch.status === 'needs_service' && roi > 40) {
      recommendations.push({
        watch,
        reason: `High potential after service (${roi.toFixed(1)}% ROI) - Consider servicing`,
        priority: 'high',
      });
    }

    // Low ROI watches that might need attention
    if (roi < 10 && watch.status !== 'sold') {
      recommendations.push({
        watch,
        reason: `Low ROI (${roi.toFixed(1)}%) - Review pricing or consider selling`,
        priority: 'medium',
      });
    }

    // Old inventory that hasn't sold
    if (watch.purchaseDate) {
      const purchaseDate = new Date(watch.purchaseDate);
      const daysSincePurchase = Math.floor((Date.now() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSincePurchase > 90 && watch.status !== 'sold') {
        recommendations.push({
          watch,
          reason: `In inventory for ${daysSincePurchase} days - Consider price adjustment`,
          priority: 'medium',
        });
      }
    }
  });

  if (recommendations.length === 0) {
    return null;
  }

  // Sort by priority
  const sorted = recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const highPriority = sorted.filter((r) => r.priority === 'high');
  const mediumPriority = sorted.filter((r) => r.priority === 'medium');

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Recommendations ({recommendations.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {highPriority.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-600 mb-2">High Priority</p>
              <div className="space-y-2">
                {highPriority.slice(0, 5).map((rec) => (
                  <div
                    key={rec.watch.id}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {rec.watch.brand || 'Unknown'} {rec.watch.model || ''}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{rec.reason}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewWatch(rec.watch.id)}
                      className="ml-2"
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mediumPriority.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-yellow-600 mb-2">Medium Priority</p>
              <div className="space-y-2">
                {mediumPriority.slice(0, 5).map((rec) => (
                  <div
                    key={rec.watch.id}
                    className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {rec.watch.brand || 'Unknown'} {rec.watch.model || ''}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{rec.reason}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewWatch(rec.watch.id)}
                      className="ml-2"
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

