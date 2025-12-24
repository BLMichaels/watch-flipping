'use client';

import { Package, Plus, Search } from 'lucide-react';
import { Button } from './ui/Button';

interface EmptyStateProps {
  type: 'no-watches' | 'no-results' | 'no-filtered';
  onAction?: () => void;
  searchTerm?: string;
}

export function EmptyState({ type, onAction, searchTerm }: EmptyStateProps) {
  if (type === 'no-watches') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-gray-100 rounded-full p-6 mb-4">
          <Package className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No watches yet</h3>
        <p className="text-gray-600 text-center mb-6 max-w-md">
          Get started by adding your first watch to your inventory. You can track purchase prices, projected revenue, and manage your collection.
        </p>
        {onAction && (
          <Button onClick={onAction}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Watch
          </Button>
        )}
      </div>
    );
  }

  if (type === 'no-results') {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="bg-gray-100 rounded-full p-6 mb-4">
          <Search className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No watches found</h3>
        <p className="text-gray-600 text-center mb-4">
          {searchTerm ? (
            <>No watches match "<span className="font-medium">{searchTerm}</span>"</>
          ) : (
            'No watches match your current filters'
          )}
        </p>
        <p className="text-sm text-gray-500">
          Try adjusting your search or filters to see more results
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-gray-100 rounded-full p-6 mb-4">
        <Search className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No watches match your filters</h3>
      <p className="text-gray-600 text-center mb-4">
        Try adjusting your filters to see more results
      </p>
    </div>
  );
}

