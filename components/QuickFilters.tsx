'use client';

import { Button } from './ui/Button';
import { Filter } from 'lucide-react';

interface QuickFiltersProps {
  onFilter: (filter: string) => void;
  activeFilter?: string;
}

const filters = [
  { id: 'high-profit', label: 'High Profit', icon: '💰' },
  { id: 'high-roi', label: 'High ROI', icon: '📈' },
  { id: 'low-cost', label: 'Low Cost', icon: '💵' },
  { id: 'recent', label: 'Recently Added', icon: '🆕' },
];

export function QuickFilters({ onFilter, activeFilter }: QuickFiltersProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-gray-600 flex items-center gap-1">
        <Filter className="h-4 w-4" />
        Quick Filters:
      </span>
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onFilter(filter.id)}
          className={activeFilter === filter.id 
            ? '' 
            : 'bg-white border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900'}
        >
          <span className="mr-1">{filter.icon}</span>
          {filter.label}
        </Button>
      ))}
    </div>
  );
}

