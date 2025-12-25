'use client';

import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Eye, Edit, Trash2, Star } from 'lucide-react';
import { FavoriteButton } from './FavoriteButton';

interface Watch {
  id: string;
  brand: string;
  model: string;
  purchasePrice: number;
  purchaseDate?: string;
  revenueServiced: number | null;
  revenueCleaned: number | null;
  revenueAsIs: number | null;
  status: string;
  tags?: string[];
  isFavorite?: boolean;
  images: string[];
}

interface WatchCardProps {
  watch: Watch;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFavorite?: (watchId: string, isFavorite: boolean) => Promise<void>;
}

export function WatchCard({ watch, onView, onEdit, onDelete, onToggleFavorite }: WatchCardProps) {
  const getBestProfit = () => {
    const bestRevenue = watch.revenueServiced || watch.revenueCleaned || watch.revenueAsIs || 0;
    return bestRevenue - watch.purchasePrice;
  };

  const getROI = () => {
    const profit = getBestProfit();
    return watch.purchasePrice > 0 ? (profit / watch.purchasePrice) * 100 : 0;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready_to_sell':
        return 'bg-green-100 text-green-800';
      case 'needs_service':
        return 'bg-yellow-100 text-yellow-800';
      case 'problem_item':
        return 'bg-red-100 text-red-800';
      case 'sold':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ready_to_sell':
        return 'Ready to Sell';
      case 'needs_service':
        return 'Needs Service';
      case 'problem_item':
        return 'Problem Item';
      case 'sold':
        return 'Sold';
      default:
        return status;
    }
  };

  const profit = getBestProfit();
  const roi = getROI();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg text-gray-900">
                {watch.brand} {watch.model}
              </h3>
              {onToggleFavorite && (
                <FavoriteButton
                  watchId={watch.id}
                  isFavorite={watch.isFavorite || false}
                  onToggle={onToggleFavorite}
                />
              )}
            </div>
            {watch.purchaseDate && (
              <p className="text-sm text-gray-500">
                Purchased: {new Date(watch.purchaseDate).toLocaleDateString()}
              </p>
            )}
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(watch.status)}`}>
            {getStatusLabel(watch.status)}
          </span>
        </div>

        {/* Image */}
        {watch.images && watch.images.length > 0 && (
          <div className="mb-3">
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={watch.images[0]}
                alt={`${watch.brand} ${watch.model}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-xs text-gray-600 mb-1">Purchase Price</p>
            <p className="text-sm font-semibold text-gray-900">
              ${watch.purchasePrice.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Projected Profit</p>
            <p className={`text-sm font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">ROI</p>
            <p className={`text-sm font-semibold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {roi.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Best Revenue</p>
            <p className="text-sm font-semibold text-gray-900">
              ${(watch.revenueServiced || watch.revenueCleaned || watch.revenueAsIs || 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Tags */}
        {watch.tags && watch.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {watch.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {watch.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                +{watch.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onView(watch.id)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(watch.id)}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(watch.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

