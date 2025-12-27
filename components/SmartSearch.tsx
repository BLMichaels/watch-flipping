'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Search, X, Filter } from 'lucide-react';
import { Button } from './ui/Button';

interface Watch {
  id: string;
  brand: string;
  model?: string;
  referenceNumber?: string;
  title?: string;
  tags?: string[];
  status: string;
}

interface SmartSearchProps {
  watches: Watch[];
  onSelectWatch: (watchId: string) => void;
  onClose?: () => void;
}

export function SmartSearch({ watches, onSelectWatch, onClose }: SmartSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<{
    brands: string[];
    statuses: string[];
    tags: string[];
  }>({
    brands: [],
    statuses: [],
    tags: [],
  });

  const allBrands = useMemo(() => {
    return Array.from(new Set(watches.map(w => w.brand).filter(Boolean)));
  }, [watches]);

  const allTags = useMemo(() => {
    const tags = watches.flatMap(w => w.tags || []);
    return Array.from(new Set(tags));
  }, [watches]);

  const filteredWatches = useMemo(() => {
    let filtered = watches;

    // Text search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(w =>
        w.brand.toLowerCase().includes(term) ||
        w.model?.toLowerCase().includes(term) ||
        w.referenceNumber?.toLowerCase().includes(term) ||
        w.title?.toLowerCase().includes(term) ||
        w.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Brand filter
    if (selectedFilters.brands.length > 0) {
      filtered = filtered.filter(w => selectedFilters.brands.includes(w.brand));
    }

    // Status filter
    if (selectedFilters.statuses.length > 0) {
      filtered = filtered.filter(w => selectedFilters.statuses.includes(w.status));
    }

    // Tag filter
    if (selectedFilters.tags.length > 0) {
      filtered = filtered.filter(w =>
        w.tags?.some(tag => selectedFilters.tags.includes(tag))
      );
    }

    return filtered;
  }, [watches, searchTerm, selectedFilters]);

  const toggleFilter = (type: 'brands' | 'statuses' | 'tags', value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value],
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({ brands: [], statuses: [], tags: [] });
    setSearchTerm('');
  };

  const hasActiveFilters = searchTerm || 
    selectedFilters.brands.length > 0 || 
    selectedFilters.statuses.length > 0 || 
    selectedFilters.tags.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Smart Search
            </CardTitle>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden flex flex-col">
          {/* Search Input */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by brand, model, reference, title, or tags..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mb-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brands
              </label>
              <div className="flex flex-wrap gap-2">
                {allBrands.slice(0, 10).map(brand => (
                  <button
                    key={brand}
                    onClick={() => toggleFilter('brands', brand)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      selectedFilters.brands.includes(brand)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {['ready_to_sell', 'needs_service', 'problem_item', 'sold'].map(status => (
                  <button
                    key={status}
                    onClick={() => toggleFilter('statuses', status)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      selectedFilters.statuses.includes(status)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {allTags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 15).map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleFilter('tags', tag)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        selectedFilters.tags.includes(tag)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {tag}
                  </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="mb-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={clearFilters}
              >
                <X className="h-4 w-4 mr-1" />
                Clear All Filters
              </Button>
            </div>
          )}

          {/* Results */}
          <div className="flex-1 overflow-y-auto">
            <div className="text-sm text-gray-600 mb-2">
              {filteredWatches.length} result{filteredWatches.length !== 1 ? 's' : ''}
            </div>
            <div className="space-y-2">
              {filteredWatches.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No watches found matching your search criteria.
                </div>
              ) : (
                filteredWatches.map(watch => (
                  <button
                    key={watch.id}
                    onClick={() => {
                      onSelectWatch(watch.id);
                      onClose?.();
                    }}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                  >
                    <div className="font-medium">{watch.brand} {watch.model || ''}</div>
                    {watch.referenceNumber && (
                      <div className="text-sm text-gray-600">Ref: {watch.referenceNumber}</div>
                    )}
                    {watch.tags && watch.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {watch.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

