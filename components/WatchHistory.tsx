'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Clock, Edit, DollarSign, Tag } from 'lucide-react';

interface HistoryEvent {
  type: 'created' | 'updated' | 'status_changed' | 'price_changed' | 'sold';
  timestamp: string;
  description: string;
  details?: string;
}

interface WatchHistoryProps {
  watchId: string;
  createdAt?: string;
  updatedAt?: string;
  purchaseDate?: string;
  soldDate?: string | null;
  status?: string;
  purchasePrice?: number;
  soldPrice?: number | null;
}

export function WatchHistory({
  watchId,
  createdAt,
  updatedAt,
  purchaseDate,
  soldDate,
  status,
  purchasePrice,
  soldPrice,
}: WatchHistoryProps) {
  const events: HistoryEvent[] = [];

  if (createdAt) {
    events.push({
      type: 'created',
      timestamp: createdAt,
      description: 'Watch added to inventory',
      details: purchasePrice ? `Purchase price: $${purchasePrice.toLocaleString()}` : undefined,
    });
  }

  if (purchaseDate && purchaseDate !== createdAt) {
    events.push({
      type: 'created',
      timestamp: purchaseDate,
      description: 'Purchase date recorded',
    });
  }

  if (updatedAt && updatedAt !== createdAt) {
    events.push({
      type: 'updated',
      timestamp: updatedAt,
      description: 'Watch information updated',
    });
  }

  if (status) {
    const statusLabels: Record<string, string> = {
      ready_to_sell: 'Ready to Sell',
      needs_service: 'Needs Service',
      problem_item: 'Problem Item',
      sold: 'Sold',
    };
    events.push({
      type: 'status_changed',
      timestamp: updatedAt || createdAt || new Date().toISOString(),
      description: `Status: ${statusLabels[status] || status}`,
    });
  }

  if (soldDate && soldPrice) {
    events.push({
      type: 'sold',
      timestamp: soldDate,
      description: 'Watch sold',
      details: `Sold for $${soldPrice.toLocaleString()}`,
    });
  }

  // Sort by timestamp (newest first)
  events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getEventIcon = (type: HistoryEvent['type']) => {
    switch (type) {
      case 'created':
        return <Clock className="h-4 w-4 text-green-600" />;
      case 'updated':
        return <Edit className="h-4 w-4 text-blue-600" />;
      case 'status_changed':
        return <Tag className="h-4 w-4 text-yellow-600" />;
      case 'price_changed':
        return <DollarSign className="h-4 w-4 text-purple-600" />;
      case 'sold':
        return <DollarSign className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEventColor = (type: HistoryEvent['type']) => {
    switch (type) {
      case 'created':
        return 'bg-green-100';
      case 'updated':
        return 'bg-blue-100';
      case 'status_changed':
        return 'bg-yellow-100';
      case 'price_changed':
        return 'bg-purple-100';
      case 'sold':
        return 'bg-green-100';
      default:
        return 'bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const then = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(dateString);
  };

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">No history available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${getEventColor(event.type)}`}>
                {getEventIcon(event.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{event.description}</p>
                {event.details && (
                  <p className="text-xs text-gray-600 mt-1">{event.details}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">{getTimeAgo(event.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

