'use client';

import { Button } from './ui/Button';
import { MoreVertical, Edit, Trash2, Eye, Star } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface QuickActionsMenuProps {
  watchId: string;
  isFavorite?: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite?: (watchId: string, isFavorite: boolean) => Promise<void>;
}

export function QuickActionsMenu({
  watchId,
  isFavorite,
  onView,
  onEdit,
  onDelete,
  onToggleFavorite,
}: QuickActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="p-1"
      >
        <MoreVertical className="h-4 w-4" />
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
          <div className="py-1">
            <button
              onClick={() => {
                onView();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View Details
            </button>
            <button
              onClick={() => {
                onEdit();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
            {onToggleFavorite && (
              <button
                onClick={async () => {
                  await onToggleFavorite(watchId, !isFavorite);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <Star className={`h-4 w-4 ${isFavorite ? 'fill-current text-yellow-500' : ''}`} />
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            )}
            <div className="border-t border-gray-200 my-1" />
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this watch?')) {
                  onDelete();
                }
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

