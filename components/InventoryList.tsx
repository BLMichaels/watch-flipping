'use client';

import React, { useState, useMemo } from 'react';
import { useDebounce } from './useDebounce';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Eye, Edit, Trash2, Search, ArrowUpDown, GitCompare, MoreVertical, LayoutGrid, List } from 'lucide-react';
import { ExportOptions } from './ExportOptions';
import { WatchComparison } from './WatchComparison';
import { QuickStats } from './QuickStats';
import { FilterPresets } from './FilterPresets';
import { AdvancedSearch } from './AdvancedSearch';
import { EmptyState } from './EmptyState';
import { Tooltip } from './Tooltip';
import { SearchSuggestions } from './SearchSuggestions';
import { QuickFilters } from './QuickFilters';
import { Pagination } from './Pagination';
import { FavoriteButton } from './FavoriteButton';
import { ItemsPerPageSelector } from './ItemsPerPageSelector';
import { WatchCard } from './WatchCard';
import { SavedSearches } from './SavedSearches';
import { CSVImport } from './CSVImport';
import { QuickCompare } from './QuickCompare';
import { ConfirmationDialog } from './ConfirmationDialog';
import { QuickFiltersBar } from './QuickFiltersBar';
import { BulkEdit } from './BulkEdit';

interface Watch {
  id: string;
  brand: string;
  model: string;
  purchasePrice: number;
  purchaseDate?: string;
  referenceNumber?: string | null;
  revenueServiced: number | null;
  revenueCleaned: number | null;
  revenueAsIs: number | null;
  status: string;
  tags?: string[];
  aiRecommendation?: string | null;
  isFavorite?: boolean;
  images: string[];
  title?: string;
}

interface InventoryListProps {
  watches: Watch[];
  onViewWatch: (id: string) => void;
  onEditWatch: (id: string) => void;
  onDeleteWatch: (id: string) => void;
  onAnalyzeWatch: (id: string) => void;
  onBulkStatusUpdate?: (ids: string[], status: string) => Promise<void>;
  onBulkDelete?: (ids: string[]) => Promise<void>;
  onAddWatch?: () => void;
  onToggleFavorite?: (watchId: string, isFavorite: boolean) => Promise<void>;
  onImportWatches?: (watches: any[]) => Promise<void>;
}

type SortField = 'brand' | 'purchasePrice' | 'profit' | 'recommendation' | 'purchaseDate' | 'roi';
type SortDirection = 'asc' | 'desc';

export function InventoryList({
  watches,
  onViewWatch,
  onEditWatch,
  onDeleteWatch,
  onAnalyzeWatch,
  onBulkStatusUpdate,
  onBulkDelete,
  onAddWatch,
  onToggleFavorite,
  onImportWatches,
}: InventoryListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [sortField, setSortField] = useState<SortField>('brand');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [showOnlyProfitable, setShowOnlyProfitable] = useState(false);
  const [selectedWatches, setSelectedWatches] = useState<Set<string>>(new Set());
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [tagFilter, setTagFilter] = useState<string>('');
  const [showComparison, setShowComparison] = useState(false);
  const [activePreset, setActivePreset] = useState<string>('');
  const [advancedSearchCriteria, setAdvancedSearchCriteria] = useState<any>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [quickFilter, setQuickFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showQuickCompare, setShowQuickCompare] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; watchId: string | null }>({
    isOpen: false,
    watchId: null,
  });
  const [showBulkEdit, setShowBulkEdit] = useState(false);

  const getBestProfit = (watch: Watch) => {
    const bestRevenue = watch.revenueServiced || watch.revenueCleaned || watch.revenueAsIs || 0;
    return bestRevenue - watch.purchasePrice;
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

  const filteredAndSortedWatches = useMemo(() => {
    // Get unique brands for filter
    const uniqueBrands = Array.from(new Set(watches.map(w => w.brand))).sort();
    
    let filtered = watches.filter((watch) => {
      const matchesSearch = !debouncedSearchTerm ||
        watch.brand?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        watch.model?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        watch.referenceNumber?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        watch.title?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || watch.status === statusFilter;
      const matchesBrand = brandFilter === 'all' || watch.brand === brandFilter;
      const matchesProfitable = !showOnlyProfitable || (() => {
        const bestRevenue = watch.revenueServiced || watch.revenueCleaned || watch.revenueAsIs || 0;
        return bestRevenue > watch.purchasePrice;
      })();
      const matchesPriceRange = (!priceRange.min || watch.purchasePrice >= parseFloat(priceRange.min)) &&
                                (!priceRange.max || watch.purchasePrice <= parseFloat(priceRange.max));
      const matchesDateRange = (!dateRange.start || (watch.purchaseDate && new Date(watch.purchaseDate) >= new Date(dateRange.start))) &&
                                (!dateRange.end || (watch.purchaseDate && new Date(watch.purchaseDate) <= new Date(dateRange.end)));
      const matchesTag = !tagFilter || (watch.tags && watch.tags.some((tag: string) => tag.toLowerCase().includes(tagFilter.toLowerCase())));
      
      // Quick filters
      let matchesQuickFilter = true;
      if (quickFilter === 'high-profit') {
        const bestRevenue = watch.revenueServiced || watch.revenueCleaned || watch.revenueAsIs || 0;
        matchesQuickFilter = (bestRevenue - watch.purchasePrice) > 1000;
      } else if (quickFilter === 'high-roi') {
        const bestRevenue = watch.revenueServiced || watch.revenueCleaned || watch.revenueAsIs || 0;
        const profit = bestRevenue - watch.purchasePrice;
        const roi = watch.purchasePrice > 0 ? (profit / watch.purchasePrice) * 100 : 0;
        matchesQuickFilter = roi > 30;
      } else if (quickFilter === 'low-cost') {
        matchesQuickFilter = watch.purchasePrice < 1000;
      } else if (quickFilter === 'recent') {
        if (watch.purchaseDate) {
          const purchaseDate = new Date(watch.purchaseDate);
          const daysSincePurchase = (Date.now() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24);
          matchesQuickFilter = daysSincePurchase <= 30;
        } else {
          matchesQuickFilter = false;
        }
      } else if (quickFilter === 'favorites') {
        matchesQuickFilter = watch.isFavorite === true;
      }
      
      return matchesSearch && matchesStatus && matchesBrand && matchesProfitable && matchesPriceRange && matchesDateRange && matchesTag && matchesQuickFilter;
    });

    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'brand':
          aValue = a.brand;
          bValue = b.brand;
          break;
        case 'purchasePrice':
          aValue = a.purchasePrice;
          bValue = b.purchasePrice;
          break;
        case 'profit':
          aValue = getBestProfit(a);
          bValue = getBestProfit(b);
          break;
        case 'recommendation':
          aValue = a.aiRecommendation || '';
          bValue = b.aiRecommendation || '';
          break;
        case 'purchaseDate':
          aValue = a.purchaseDate ? new Date(a.purchaseDate).getTime() : 0;
          bValue = b.purchaseDate ? new Date(b.purchaseDate).getTime() : 0;
          break;
        case 'roi':
          const aBest = a.revenueServiced || a.revenueCleaned || a.revenueAsIs || 0;
          const bBest = b.revenueServiced || b.revenueCleaned || b.revenueAsIs || 0;
          aValue = a.purchasePrice > 0 ? ((aBest - a.purchasePrice) / a.purchasePrice) * 100 : 0;
          bValue = b.purchasePrice > 0 ? ((bBest - b.purchasePrice) / b.purchasePrice) * 100 : 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [watches, debouncedSearchTerm, sortField, sortDirection, statusFilter, brandFilter, showOnlyProfitable, priceRange, dateRange, tagFilter, advancedSearchCriteria, quickFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedWatches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedWatches = filteredAndSortedWatches.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, brandFilter, showOnlyProfitable, quickFilter]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleWatchSelection = (id: string) => {
    setSelectedWatches(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    if (selectedWatches.size === filteredAndSortedWatches.length) {
      setSelectedWatches(new Set());
    } else {
      setSelectedWatches(new Set(filteredAndSortedWatches.map(w => w.id)));
    }
  };

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedWatches.size === 0 || !onBulkStatusUpdate) return;
    await onBulkStatusUpdate(Array.from(selectedWatches), status);
    setSelectedWatches(new Set());
  };

  const handleBulkDelete = async () => {
    if (selectedWatches.size === 0 || !onBulkDelete) return;
    if (!confirm(`Delete ${selectedWatches.size} watch(es)?`)) return;
    await onBulkDelete(Array.from(selectedWatches));
    setSelectedWatches(new Set());
  };

  const handleCompare = () => {
    if (selectedWatches.size >= 2) {
      setShowComparison(true);
    } else {
      alert('Please select at least 2 watches to compare');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory</h1>
              <p className="text-gray-600">Manage your watch collection</p>
            </div>
            <div className="flex items-center gap-2">
              {selectedWatches.size > 0 && (
                <>
                  {selectedWatches.size >= 2 && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowQuickCompare(true)}
                    >
                      <GitCompare className="h-4 w-4 mr-1" />
                      Compare ({selectedWatches.size})
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowBulkEdit(true)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Bulk Edit ({selectedWatches.size})
                  </Button>
                </>
              )}
              <ExportOptions watches={watches} />
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-1">Total Watches</p>
                <p className="text-2xl font-bold text-gray-900">{watches.length}</p>
              </div>
            </Card>
            <Card>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-1">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${watches.reduce((sum, w) => sum + w.purchasePrice, 0).toLocaleString()}
                </p>
              </div>
            </Card>
            <Card>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-1">Ready to Sell</p>
                <p className="text-2xl font-bold text-green-600">
                  {watches.filter(w => w.status === 'ready_to_sell').length}
                </p>
              </div>
            </Card>
            <Card>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-1">Total Profit</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${watches.reduce((sum, w) => {
                    const best = w.revenueServiced || w.revenueCleaned || w.revenueAsIs || 0;
                    return sum + (best - w.purchasePrice);
                  }, 0).toLocaleString()}
                </p>
              </div>
            </Card>
          </div>
        </div>

        <QuickStats watches={watches} />

        {/* Advanced Filters */}
        <div className="mb-4">
          <AdvancedFilters
            onApply={(filters) => {
              // Apply advanced filters
              if (filters.minPrice !== undefined) setPriceRange(prev => ({ ...prev, min: filters.minPrice!.toString() }));
              if (filters.maxPrice !== undefined) setPriceRange(prev => ({ ...prev, max: filters.maxPrice!.toString() }));
              if (filters.dateFrom) setDateRange(prev => ({ ...prev, start: filters.dateFrom! }));
              if (filters.dateTo) setDateRange(prev => ({ ...prev, end: filters.dateTo! }));
              if (filters.brands && filters.brands.length > 0) setBrandFilter(filters.brands[0]);
              if (filters.statuses && filters.statuses.length > 0) setStatusFilter(filters.statuses[0]);
            }}
            onClear={() => {
              setPriceRange({ min: '', max: '' });
              setDateRange({ start: '', end: '' });
              setBrandFilter('all');
              setStatusFilter('all');
            }}
            brands={Array.from(new Set(watches.map(w => w.brand).filter(Boolean)))}
          />
        </div>
        
        {/* Quick Filters Bar */}
        <QuickFiltersBar
          activeFilters={{
            status: statusFilter !== 'all' ? statusFilter : undefined,
            brand: brandFilter !== 'all' ? brandFilter : undefined,
            priceRange: priceRange.min || priceRange.max ? priceRange : undefined,
            dateRange: dateRange.start || dateRange.end ? dateRange : undefined,
            tags: tagFilter ? [tagFilter] : undefined,
          }}
          onRemoveFilter={(filterType) => {
            if (filterType === 'status') setStatusFilter('all');
            else if (filterType === 'brand') setBrandFilter('all');
            else if (filterType === 'priceRange') setPriceRange({ min: '', max: '' });
            else if (filterType === 'dateRange') setDateRange({ start: '', end: '' });
            else if (filterType === 'tags') setTagFilter('');
          }}
          onClearAll={() => {
            setStatusFilter('all');
            setBrandFilter('all');
            setPriceRange({ min: '', max: '' });
            setDateRange({ start: '', end: '' });
            setTagFilter('');
            setShowOnlyProfitable(false);
          }}
        />
        
        {/* Saved Searches */}
        <SavedSearches
          onLoadSearch={(filters) => {
            if (filters.searchTerm) setSearchTerm(filters.searchTerm);
            if (filters.status) setStatusFilter(filters.status);
            if (filters.brand) setBrandFilter(filters.brand);
            if (filters.quickFilter) setQuickFilter(filters.quickFilter);
            setCurrentPage(1);
          }}
          currentFilters={{
            searchTerm,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            brand: brandFilter !== 'all' ? brandFilter : undefined,
            quickFilter: quickFilter || undefined,
          }}
        />
        
        <div className="mb-4">
          <QuickFilters
            onFilter={(filter) => {
              setQuickFilter(filter === quickFilter ? '' : filter);
              setActivePreset('');
            }}
            activeFilter={quickFilter}
          />
        </div>
        <div className="mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <FilterPresets
            onApplyPreset={(preset) => {
              setActivePreset(preset.id);
              if (preset.filters.status) setStatusFilter(preset.filters.status);
              if (preset.filters.brand) setBrandFilter(preset.filters.brand);
              if (preset.filters.profitable !== undefined) setShowOnlyProfitable(preset.filters.profitable);
            }}
            onClearFilters={() => {
              setActivePreset('');
              setQuickFilter('');
              setStatusFilter('all');
              setBrandFilter('all');
              setShowOnlyProfitable(false);
              setPriceRange({ min: '', max: '' });
              setDateRange({ start: '', end: '' });
              setTagFilter('');
              setAdvancedSearchCriteria(null);
            }}
            activePreset={activePreset}
          />
          <AdvancedSearch
            onSearch={(criteria) => setAdvancedSearchCriteria(criteria)}
            onClear={() => setAdvancedSearchCriteria(null)}
            brands={Array.from(new Set(watches.map(w => w.brand))).sort()}
          />
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
              <input
                type="text"
                placeholder="Search by brand or model..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {showSuggestions && (
                <SearchSuggestions
                  watches={watches}
                  searchTerm={searchTerm}
                  onSelect={(suggestion) => {
                    setSearchTerm(suggestion);
                    setShowSuggestions(false);
                  }}
                />
              )}
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="ready_to_sell">Ready to Sell</option>
              <option value="needs_service">Needs Service</option>
              <option value="problem_item">Problem Item</option>
              <option value="sold">Sold</option>
            </select>
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Brands</option>
              {Array.from(new Set(watches.map(w => w.brand))).sort().map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          {filteredAndSortedWatches.length !== watches.length && (
            <div className="mt-2 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {filteredAndSortedWatches.length} of {watches.length} watches
              </div>
              <ExportOptions watches={filteredAndSortedWatches} label="Export Filtered" />
            </div>
          )}
        </Card>

        {/* View Mode Toggle */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">View:</span>
            <Button
              variant={viewMode === 'table' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('table')}
              className={viewMode === 'table' ? '' : 'bg-white border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50'}
            >
              <List className="h-4 w-4 mr-1" />
              Table
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('cards')}
              className={viewMode === 'cards' ? '' : 'bg-white border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50'}
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              Cards
            </Button>
          </div>
        </div>

        {/* Table View */}
        {viewMode === 'table' && (
          <Card className="overflow-x-auto">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 w-12">
                    <input
                      type="checkbox"
                      checked={selectedWatches.size === filteredAndSortedWatches.length && filteredAndSortedWatches.length > 0}
                      onChange={selectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    <button
                      onClick={() => handleSort('brand')}
                      className="flex items-center gap-2 hover:text-gray-900"
                    >
                      Brand
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Model</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    <button
                      onClick={() => handleSort('purchasePrice')}
                      className="flex items-center gap-2 hover:text-gray-900"
                    >
                      Purchase Price
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    <button
                      onClick={() => handleSort('profit')}
                      className="flex items-center gap-2 hover:text-gray-900"
                    >
                      Best-Case Profit
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    <Tooltip content="Return on Investment percentage - (Profit / Purchase Price) × 100">
                      <button
                        onClick={() => handleSort('roi')}
                        className="flex items-center gap-2 hover:text-gray-900"
                      >
                        ROI %
                        <ArrowUpDown className="h-4 w-4" />
                      </button>
                    </Tooltip>
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    <button
                      onClick={() => handleSort('recommendation')}
                      className="flex items-center gap-2 hover:text-gray-900"
                    >
                      Recommendation
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedWatches.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8">
                      <EmptyState
                        type={watches.length === 0 ? 'no-watches' : (searchTerm || statusFilter !== 'all' || brandFilter !== 'all' || showOnlyProfitable || advancedSearchCriteria ? 'no-results' : 'no-filtered')}
                        onAction={watches.length === 0 ? onAddWatch : undefined}
                        searchTerm={searchTerm}
                      />
                    </td>
                  </tr>
                ) : (
                  paginatedWatches.map((watch: Watch) => (
                    <tr key={watch.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedWatches.has(watch.id)}
                          onChange={() => toggleWatchSelection(watch.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="py-3 px-4">{watch.brand}</td>
                      <td className="py-3 px-4">{watch.model}</td>
                      <td className="py-3 px-4">${watch.purchasePrice.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-green-600">
                          ${getBestProfit(watch).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {(() => {
                          const bestRevenue = watch.revenueServiced || watch.revenueCleaned || watch.revenueAsIs || 0;
                          const profit = bestRevenue - watch.purchasePrice;
                          const roi = watch.purchasePrice > 0 ? (profit / watch.purchasePrice) * 100 : 0;
                          return (
                            <span className={`font-semibold ${roi > 0 ? 'text-green-600' : roi < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                              {roi.toFixed(1)}%
                            </span>
                          );
                        })()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            watch.status
                          )}`}
                        >
                          {getStatusLabel(watch.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {watch.aiRecommendation ? (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              watch.aiRecommendation === 'buy'
                                ? 'bg-green-100 text-green-800'
                                : watch.aiRecommendation === 'pass'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {watch.aiRecommendation.toUpperCase()}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">Not analyzed</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          {onToggleFavorite && (
                            <FavoriteButton
                              watchId={watch.id}
                              isFavorite={watch.isFavorite || false}
                              onToggle={onToggleFavorite}
                            />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewWatch(watch.id)}
                            title="View Details"
                            className="p-1"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditWatch(watch.id)}
                            title="Edit"
                            className="p-1"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setConfirmDelete({ isOpen: true, watchId: watch.id })}
                            title="Delete"
                            className="p-1"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
            </tbody>
          </table>
        </div>
      </Card>
        )}

        {/* Card View */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedWatches.map((watch: Watch) => (
              <WatchCard
                key={watch.id}
                watch={watch}
                onView={onViewWatch}
                onEdit={onEditWatch}
                onDelete={onDeleteWatch}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
      {showComparison && selectedWatches.size >= 2 && (
        <WatchComparison
          watches={filteredAndSortedWatches.filter((w: Watch) => selectedWatches.has(w.id))}
          onClose={() => {
            setShowComparison(false);
            setSelectedWatches(new Set());
          }}
        />
      )}

      {showQuickCompare && selectedWatches.size >= 2 && (
        <QuickCompare
          watches={filteredAndSortedWatches.filter((w: Watch) => selectedWatches.has(w.id))}
          onClose={() => {
            setShowQuickCompare(false);
            setSelectedWatches(new Set());
          }}
        />
      )}

      {/* Pagination Controls */}
      {filteredAndSortedWatches.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
          <ItemsPerPageSelector
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={(items) => {
              setItemsPerPage(items);
              setCurrentPage(1);
            }}
          />
          {filteredAndSortedWatches.length > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredAndSortedWatches.length}
            />
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDelete.isOpen}
        title="Delete Watch"
        message="Are you sure you want to delete this watch? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={() => {
          if (confirmDelete.watchId) {
            onDeleteWatch(confirmDelete.watchId);
            setConfirmDelete({ isOpen: false, watchId: null });
          }
        }}
        onCancel={() => setConfirmDelete({ isOpen: false, watchId: null })}
      />

      {/* Bulk Edit */}
      {showBulkEdit && (
        <BulkEdit
          selectedWatches={selectedWatches}
          onBulkUpdate={async (ids, updates) => {
            // Update all selected watches
            await Promise.all(ids.map(async (id) => {
              const watch = watches.find(w => w.id === id);
              if (!watch) return;
              
              const updateData: any = { ...watch };
              if (updates.status) updateData.status = updates.status;
              if (updates.tags) {
                const existingTags = watch.tags || [];
                const newTags = updates.tags;
                updateData.tags = [...new Set([...existingTags, ...newTags])];
              }
              if (updates.serviceCost !== undefined) updateData.serviceCost = updates.serviceCost;
              if (updates.cleaningCost !== undefined) updateData.cleaningCost = updates.cleaningCost;
              if (updates.otherCosts !== undefined) updateData.otherCosts = updates.otherCosts;

              const response = await fetch(`/api/watches/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData),
              });
              return response.ok;
            }));
            
            // Refresh the list
            if (onBulkStatusUpdate) {
              await onBulkStatusUpdate(ids, updates.status || '');
            }
          }}
          onClose={() => {
            setShowBulkEdit(false);
            setSelectedWatches(new Set());
          }}
        />
      )}
    </div>
  );
}

