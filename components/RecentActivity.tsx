'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Clock, Plus, Edit, Trash2 } from 'lucide-react';

interface Watch {
  id: string;
  brand: string;
  model?: string;
  createdAt: string;
  updatedAt: string;
}

interface RecentActivityProps {
  watches: Watch[];
  limit?: number;
}

export function RecentActivity({ watches, limit = 5 }: RecentActivityProps) {
  // Sort by most recently updated
  const recentWatches = [...watches]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  };

  if (recentWatches.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentWatches.map((watch) => {
            const isNew = new Date(watch.createdAt).getTime() === new Date(watch.updatedAt).getTime();
            return (
              <div key={watch.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-full ${
                  isNew ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {isNew ? (
                    <Plus className="h-4 w-4 text-green-600" />
                  ) : (
                    <Edit className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {watch.brand} {watch.model || ''}
                  </p>
                  <p className="text-xs text-gray-500">
                    {isNew ? 'Added' : 'Updated'} {getTimeAgo(watch.updatedAt)}
                  </p>
                </div>
                <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

