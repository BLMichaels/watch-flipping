'use client';

import { useState, useEffect } from 'react';

interface Watch {
  brand: string;
  model?: string;
  referenceNumber?: string | null;
}

interface SearchSuggestionsProps {
  watches: Watch[];
  searchTerm: string;
  onSelect: (suggestion: string) => void;
}

export function SearchSuggestions({ watches, searchTerm, onSelect }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const uniqueSuggestions = new Set<string>();

    watches.forEach((watch) => {
      if (watch.brand.toLowerCase().includes(term)) {
        uniqueSuggestions.add(watch.brand);
      }
      if (watch.model && watch.model.toLowerCase().includes(term)) {
        uniqueSuggestions.add(watch.model);
      }
      if (watch.referenceNumber && watch.referenceNumber.toLowerCase().includes(term)) {
        uniqueSuggestions.add(watch.referenceNumber);
      }
    });

    setSuggestions(Array.from(uniqueSuggestions).slice(0, 5));
  }, [searchTerm, watches]);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
        >
          <span className="text-sm text-gray-900">{suggestion}</span>
        </button>
      ))}
    </div>
  );
}

