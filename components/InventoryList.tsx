'use client';

import { useState, useMemo } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Eye, Edit, Trash2, Search, ArrowUpDown } from 'lucide-react';
import { ExportButton } from './ExportButton';

interface Watch {
  id: string;
  brand: string;
  model: string;
  purchasePrice: number;
  purchaseDate?: string;
  revenueServiced: number | null;
  revenueCleaned: number | null;
  revenueAsIs: number | null;
  status: string;
  tags?: string[];
  aiRecommendation?: string | null;
}

interface InventoryListProps {
  watches: Watch[];
  onViewWatch: (id: string) => void;
  onEditWatch: (id: string) => void;
  onDeleteWatch: (id: string) => void;
  onAnalyzeWatch: (id: string) => void;
  onBulkStatusUpdate?: (ids: string[], status: string) => Promise<void>;
  onBulkDelete?: (ids: string[]) => Promise<void>;
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
}: InventoryListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('brand');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [showOnlyProfitable, setShowOnlyProfitable] = useState(false);
  const [selectedWatches, setSelectedWatches] = useState<Set<string>>(new Set());
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [tagFilter, setTagFilter] = useState<string>('');

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
      const matchesSearch =
        watch.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        watch.model.toLowerCase().includes(searchTerm.toLowerCase());
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
      return matchesSearch && matchesStatus && matchesBrand && matchesProfitable && matchesPriceRange && matchesDateRange && matchesTag;
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
  }, [watches, searchTerm, sortField, sortDirection, statusFilter, brandFilter, showOnlyProfitable, priceRange, dateRange, tagFilter]);

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory</h1>
              <p className="text-gray-600">Manage your watch collection</p>
            </div>
            <ExportButton watches={watches} />
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

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by brand or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
              <ExportButton watches={filteredAndSortedWatches} label="Export Filtered" />
            </div>
          )}
        </Card>

        {/* Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
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
                    <button
                      onClick={() => handleSort('roi')}
                      className="flex items-center gap-2 hover:text-gray-900"
                    >
                      ROI %
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
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
                    <td colSpan={9} className="py-8 text-center text-gray-500">
                      No watches found. {searchTerm || statusFilter !== 'all' || brandFilter !== 'all' || showOnlyProfitable
                        ? 'Try adjusting your filters.'
                        : 'Add your first watch to get started!'}
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedWatches.map((watch: Watch) => (
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
                            onClick={() => onDeleteWatch(watch.id)}
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
      </div>
    </div>
  );
}

