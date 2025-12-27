'use client';

import { Button } from './ui/Button';
import { X } from 'lucide-react';

interface QuickFiltersBarProps {
  activeFilters: {
    status?: string;
    brand?: string;
    priceRange?: { min: string; max: string };
    dateRange?: { start: string; end: string };
    tags?: string[];
  };
  onRemoveFilter: (filterType: string) => void;
  onClearAll: () => void;
}

export function QuickFiltersBar({ activeFilters, onRemoveFilter, onClearAll }: QuickFiltersBarProps) {
  const hasActiveFilters = 
    activeFilters.status ||
    activeFilters.brand ||
    activeFilters.priceRange?.min ||
    activeFilters.priceRange?.max ||
    activeFilters.dateRange?.start ||
    activeFilters.dateRange?.end ||
    (activeFilters.tags && activeFilters.tags.length > 0);

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
      <span className="text-sm font-medium text-blue-900">Active Filters:</span>
      
      {activeFilters.status && (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
          Status: {activeFilters.status.replace('_', ' ')}
          <button
            onClick={() => onRemoveFilter('status')}
            className="hover:text-blue-900"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {activeFilters.brand && (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
          Brand: {activeFilters.brand}
          <button
            onClick={() => onRemoveFilter('brand')}
            className="hover:text-blue-900"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {(activeFilters.priceRange?.min || activeFilters.priceRange?.max) && (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
          Price: ${activeFilters.priceRange.min || '0'} - ${activeFilters.priceRange.max || '∞'}
          <button
            onClick={() => onRemoveFilter('priceRange')}
            className="hover:text-blue-900"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {(activeFilters.dateRange?.start || activeFilters.dateRange?.end) && (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
          Date: {activeFilters.dateRange.start || 'Any'} - {activeFilters.dateRange.end || 'Any'}
          <button
            onClick={() => onRemoveFilter('dateRange')}
            className="hover:text-blue-900"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {activeFilters.tags && activeFilters.tags.length > 0 && (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
          Tags: {activeFilters.tags.join(', ')}
          <button
            onClick={() => onRemoveFilter('tags')}
            className="hover:text-blue-900"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="ml-auto text-blue-700 hover:text-blue-900"
      >
        Clear All
      </Button>
    </div>
  );
}

