'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Bell, Clock, CheckCircle } from 'lucide-react';

interface Watch {
  id: string;
  brand: string;
  model: string;
  status: string;
  notes?: string | null;
  purchaseDate?: string;
}

interface WatchRemindersProps {
  watches: Watch[];
}

export function WatchReminders({ watches }: WatchRemindersProps) {
  // Find watches that might need attention
  const needsAttention = watches.filter(w => {
    // Watches that have been in "needs_service" for a while
    if (w.status === 'needs_service') {
      if (w.purchaseDate) {
        const purchaseDate = new Date(w.purchaseDate);
        const daysSincePurchase = (Date.now() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysSincePurchase > 30; // More than 30 days
      }
    }
    // Watches with notes that might indicate issues
    if (w.notes && (w.notes.toLowerCase().includes('remind') || w.notes.toLowerCase().includes('follow up'))) {
      return true;
    }
    return false;
  });

  const readyToSell = watches.filter(w => w.status === 'ready_to_sell');
  const problemItems = watches.filter(w => w.status === 'problem_item');

  if (needsAttention.length === 0 && readyToSell.length === 0 && problemItems.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-yellow-600" />
          <CardTitle>Reminders & Alerts</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {readyToSell.length > 0 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-900">
                  {readyToSell.length} watch{readyToSell.length !== 1 ? 'es' : ''} ready to list
                </span>
              </div>
              <p className="text-sm text-green-700">
                These watches are ready to be listed for sale.
              </p>
            </div>
          )}

          {needsAttention.length > 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-yellow-900">
                  {needsAttention.length} watch{needsAttention.length !== 1 ? 'es' : ''} need attention
                </span>
              </div>
              <p className="text-sm text-yellow-700">
                Some watches have been waiting for service or have reminders in notes.
              </p>
              <ul className="mt-2 space-y-1">
                {needsAttention.slice(0, 3).map((watch) => (
                  <li key={watch.id} className="text-xs text-yellow-800">
                    • {watch.brand} {watch.model}
                  </li>
                ))}
                {needsAttention.length > 3 && (
                  <li className="text-xs text-yellow-800">
                    ...and {needsAttention.length - 3} more
                  </li>
                )}
              </ul>
            </div>
          )}

          {problemItems.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Bell className="h-4 w-4 text-red-600" />
                <span className="font-medium text-red-900">
                  {problemItems.length} problem item{problemItems.length !== 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-sm text-red-700">
                These watches have been marked as problem items and may need review.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

