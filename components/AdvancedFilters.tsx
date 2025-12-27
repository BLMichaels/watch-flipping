'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Filter, X } from 'lucide-react';
import { useState } from 'react';

interface AdvancedFiltersProps {
  onApply: (filters: {
    minPrice?: number;
    maxPrice?: number;
    minROI?: number;
    maxROI?: number;
    minProfit?: number;
    brands?: string[];
    statuses?: string[];
    dateFrom?: string;
    dateTo?: string;
  }) => void;
  onClear: () => void;
  brands: string[];
}

export function AdvancedFilters({ onApply, onClear, brands }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minROI: '',
    maxROI: '',
    minProfit: '',
    selectedBrands: [] as string[],
    selectedStatuses: [] as string[],
    dateFrom: '',
    dateTo: '',
  });

  const handleApply = () => {
    onApply({
      minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
      minROI: filters.minROI ? parseFloat(filters.minROI) : undefined,
      maxROI: filters.maxROI ? parseFloat(filters.maxROI) : undefined,
      minProfit: filters.minProfit ? parseFloat(filters.minProfit) : undefined,
      brands: filters.selectedBrands.length > 0 ? filters.selectedBrands : undefined,
      statuses: filters.selectedStatuses.length > 0 ? filters.selectedStatuses : undefined,
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
    });
    setIsOpen(false);
  };

  const handleClear = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      minROI: '',
      maxROI: '',
      minProfit: '',
      selectedBrands: [],
      selectedStatuses: [],
      dateFrom: '',
      dateTo: '',
    });
    onClear();
    setIsOpen(false);
  };

  const toggleBrand = (brand: string) => {
    setFilters(prev => ({
      ...prev,
      selectedBrands: prev.selectedBrands.includes(brand)
        ? prev.selectedBrands.filter(b => b !== brand)
        : [...prev.selectedBrands, brand],
    }));
  };

  const toggleStatus = (status: string) => {
    setFilters(prev => ({
      ...prev,
      selectedStatuses: prev.selectedStatuses.includes(status)
        ? prev.selectedStatuses.filter(s => s !== status)
        : [...prev.selectedStatuses, status],
    }));
  };

  if (!isOpen) {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(true)}
      >
        <Filter className="h-4 w-4 mr-1" />
        Advanced Filters
      </Button>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Filters
          </CardTitle>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Price
              </label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                placeholder="$0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price
              </label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                placeholder="$∞"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min ROI %
              </label>
              <input
                type="number"
                value={filters.minROI}
                onChange={(e) => setFilters({ ...filters, minROI: e.target.value })}
                placeholder="0%"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Profit
              </label>
              <input
                type="number"
                value={filters.minProfit}
                onChange={(e) => setFilters({ ...filters, minProfit: e.target.value })}
                placeholder="$0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brands
            </label>
            <div className="flex flex-wrap gap-2">
              {brands.slice(0, 10).map((brand) => (
                <button
                  key={brand}
                  onClick={() => toggleBrand(brand)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    filters.selectedBrands.includes(brand)
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
              {['ready_to_sell', 'needs_service', 'problem_item', 'sold'].map((status) => (
                <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    filters.selectedStatuses.includes(status)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date From
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date To
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="primary" onClick={handleApply} className="flex-1">
              Apply Filters
            </Button>
            <Button variant="secondary" onClick={handleClear}>
              Clear All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

