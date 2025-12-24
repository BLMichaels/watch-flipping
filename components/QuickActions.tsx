'use client';

import { Button } from './ui/Button';
import { Plus, Filter, Download } from 'lucide-react';

interface QuickActionsProps {
  onAddWatch: () => void;
  onExport?: () => void;
}

export function QuickActions({ onAddWatch, onExport }: QuickActionsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      <Button onClick={onAddWatch} size="sm">
        <Plus className="h-4 w-4 mr-2" />
        Quick Add
      </Button>
      {onExport && (
        <Button variant="secondary" onClick={onExport} size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      )}
    </div>
  );
}

