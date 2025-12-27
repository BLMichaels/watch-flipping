'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Edit, X } from 'lucide-react';
import { useState } from 'react';

interface BulkEditProps {
  selectedWatches: Set<string>;
  onBulkUpdate: (ids: string[], updates: any) => Promise<void>;
  onClose: () => void;
}

export function BulkEdit({ selectedWatches, onBulkUpdate, onClose }: BulkEditProps) {
  const [updates, setUpdates] = useState({
    status: '',
    tags: '',
    serviceCost: '',
    cleaningCost: '',
    otherCosts: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    if (selectedWatches.size === 0) return;

    setIsUpdating(true);
    try {
      const updateData: any = {};
      
      if (updates.status) updateData.status = updates.status;
      if (updates.tags) updateData.tags = updates.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t);
      if (updates.serviceCost) updateData.serviceCost = parseFloat(updates.serviceCost);
      if (updates.cleaningCost) updateData.cleaningCost = parseFloat(updates.cleaningCost);
      if (updates.otherCosts) updateData.otherCosts = parseFloat(updates.otherCosts);

      await onBulkUpdate(Array.from(selectedWatches), updateData);
      onClose();
    } catch (error) {
      console.error('Error updating watches:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (selectedWatches.size === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Bulk Edit ({selectedWatches.size} watches)
            </CardTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={updates.status}
                onChange={(e) => setUpdates({ ...updates, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">No change</option>
                <option value="ready_to_sell">Ready to Sell</option>
                <option value="needs_service">Needs Service</option>
                <option value="problem_item">Problem Item</option>
                <option value="sold">Sold</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add Tags (comma-separated)
              </label>
              <input
                type="text"
                value={updates.tags}
                onChange={(e) => setUpdates({ ...updates, tags: e.target.value })}
                placeholder="e.g., vintage, luxury, repair"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Cost
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={updates.serviceCost}
                  onChange={(e) => setUpdates({ ...updates, serviceCost: e.target.value })}
                  placeholder="$0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cleaning Cost
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={updates.cleaningCost}
                  onChange={(e) => setUpdates({ ...updates, cleaningCost: e.target.value })}
                  placeholder="$0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Other Costs
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={updates.otherCosts}
                  onChange={(e) => setUpdates({ ...updates, otherCosts: e.target.value })}
                  placeholder="$0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="primary"
                onClick={handleUpdate}
                disabled={isUpdating}
                className="flex-1"
              >
                {isUpdating ? 'Updating...' : 'Apply to All'}
              </Button>
              <Button
                variant="secondary"
                onClick={onClose}
                disabled={isUpdating}
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

