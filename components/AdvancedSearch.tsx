'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface AdvancedSearchProps {
  onSearch: (criteria: SearchCriteria) => void;
  onClear: () => void;
  brands: string[];
}

interface SearchCriteria {
  query: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minROI?: number;
  status?: string;
  tags?: string;
}

export function AdvancedSearch({ onSearch, onClear, brands }: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [criteria, setCriteria] = useState<SearchCriteria>({
    query: '',
    brand: '',
    minPrice: undefined,
    maxPrice: undefined,
    minROI: undefined,
    status: '',
    tags: '',
  });

  const handleSearch = () => {
    onSearch(criteria);
    setIsOpen(false);
  };

  const handleClear = () => {
    setCriteria({
      query: '',
      brand: '',
      minPrice: undefined,
      maxPrice: undefined,
      minROI: undefined,
      status: '',
      tags: '',
    });
    onClear();
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(true)}
      >
        <Search className="h-4 w-4 mr-2" />
        Advanced Search
      </Button>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Advanced Search</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Query
            </label>
            <input
              type="text"
              value={criteria.query}
              onChange={(e) => setCriteria({ ...criteria, query: e.target.value })}
              placeholder="Brand, model, reference..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand
            </label>
            <select
              value={criteria.brand}
              onChange={(e) => setCriteria({ ...criteria, brand: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={criteria.status}
              onChange={(e) => setCriteria({ ...criteria, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="ready_to_sell">Ready to Sell</option>
              <option value="needs_service">Needs Service</option>
              <option value="problem_item">Problem Item</option>
              <option value="sold">Sold</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Price
            </label>
            <input
              type="number"
              value={criteria.minPrice || ''}
              onChange={(e) => setCriteria({ ...criteria, minPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Price
            </label>
            <input
              type="number"
              value={criteria.maxPrice || ''}
              onChange={(e) => setCriteria({ ...criteria, maxPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
              placeholder="No limit"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min ROI %
            </label>
            <input
              type="number"
              value={criteria.minROI || ''}
              onChange={(e) => setCriteria({ ...criteria, minROI: e.target.value ? parseFloat(e.target.value) : undefined })}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={criteria.tags}
              onChange={(e) => setCriteria({ ...criteria, tags: e.target.value })}
              placeholder="vintage, luxury, investment"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="secondary" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

