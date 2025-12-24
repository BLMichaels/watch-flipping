'use client';

import { Button } from './ui/Button';
import { Filter, X } from 'lucide-react';

interface FilterPreset {
  id: string;
  name: string;
  filters: {
    status?: string;
    brand?: string;
    profitable?: boolean;
  };
}

const defaultPresets: FilterPreset[] = [
  {
    id: 'ready-to-sell',
    name: 'Ready to Sell',
    filters: { status: 'ready_to_sell' },
  },
  {
    id: 'needs-service',
    name: 'Needs Service',
    filters: { status: 'needs_service' },
  },
  {
    id: 'profitable',
    name: 'Profitable Only',
    filters: { profitable: true },
  },
  {
    id: 'sold',
    name: 'Sold',
    filters: { status: 'sold' },
  },
];

interface FilterPresetsProps {
  onApplyPreset: (preset: FilterPreset) => void;
  onClearFilters: () => void;
  activePreset?: string;
}

export function FilterPresets({ onApplyPreset, onClearFilters, activePreset }: FilterPresetsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap mb-4">
      <span className="text-sm text-gray-600 flex items-center gap-1">
        <Filter className="h-4 w-4" />
        Quick Filters:
      </span>
      {defaultPresets.map((preset) => (
        <Button
          key={preset.id}
          variant={activePreset === preset.id ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onApplyPreset(preset)}
        >
          {preset.name}
        </Button>
      ))}
      {activePreset && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}

