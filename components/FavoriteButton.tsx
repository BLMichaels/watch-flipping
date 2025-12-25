'use client';

import { Button } from './ui/Button';
import { Star } from 'lucide-react';
import { useState } from 'react';

interface FavoriteButtonProps {
  watchId: string;
  isFavorite: boolean;
  onToggle: (watchId: string, isFavorite: boolean) => Promise<void>;
}

export function FavoriteButton({ watchId, isFavorite, onToggle }: FavoriteButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onToggle(watchId, !isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={loading}
      className={isFavorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-yellow-500'}
    >
      <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
    </Button>
  );
}

