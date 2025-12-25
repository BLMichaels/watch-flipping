'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Bookmark, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SavedSearch {
  id: string;
  name: string;
  filters: {
    searchTerm?: string;
    status?: string;
    brand?: string;
    quickFilter?: string;
  };
}

interface SavedSearchesProps {
  onLoadSearch: (filters: SavedSearch['filters']) => void;
  currentFilters?: {
    searchTerm?: string;
    status?: string;
    brand?: string;
    quickFilter?: string;
  };
}

export function SavedSearches({ onLoadSearch, currentFilters }: SavedSearchesProps) {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    // Load saved searches from localStorage
    const saved = localStorage.getItem('watchSavedSearches');
    if (saved) {
      try {
        setSavedSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading saved searches:', e);
      }
    }
  }, []);

  const saveCurrentSearch = (filters: SavedSearch['filters']) => {
    if (!searchName.trim()) return;

    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: searchName.trim(),
      filters,
    };

    const updated = [...savedSearches, newSearch];
    setSavedSearches(updated);
    localStorage.setItem('watchSavedSearches', JSON.stringify(updated));
    setSearchName('');
    setShowSaveDialog(false);
  };

  const deleteSearch = (id: string) => {
    const updated = savedSearches.filter(s => s.id !== id);
    setSavedSearches(updated);
    localStorage.setItem('watchSavedSearches', JSON.stringify(updated));
  };

  if (savedSearches.length === 0 && !showSaveDialog) {
    return null;
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Saved Searches
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSaveDialog(true)}
          >
            Save Current
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showSaveDialog && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
            <input
              type="text"
              placeholder="Search name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchName.trim() && currentFilters) {
                  saveCurrentSearch(currentFilters);
                }
              }}
            />
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (currentFilters) {
                    saveCurrentSearch(currentFilters);
                  }
                }}
                disabled={!searchName.trim() || !currentFilters}
              >
                Save
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setShowSaveDialog(false);
                  setSearchName('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {savedSearches.map((search) => (
            <div
              key={search.id}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <button
                onClick={() => onLoadSearch(search.filters)}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                {search.name}
              </button>
              <button
                onClick={() => deleteSearch(search.id)}
                className="text-gray-400 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

