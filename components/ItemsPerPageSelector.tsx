'use client';

import { Button } from './ui/Button';

interface ItemsPerPageSelectorProps {
  itemsPerPage: number;
  onItemsPerPageChange: (items: number) => void;
  options?: number[];
}

export function ItemsPerPageSelector({
  itemsPerPage,
  onItemsPerPageChange,
  options = [10, 20, 50, 100],
}: ItemsPerPageSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Items per page:</span>
      <div className="flex gap-1">
        {options.map((option) => (
          <Button
            key={option}
            variant={itemsPerPage === option ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onItemsPerPageChange(option)}
            className={itemsPerPage === option 
              ? '' 
              : 'bg-white border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900'}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}

