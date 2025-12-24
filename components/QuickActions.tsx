'use client';

import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Plus, Download, TrendingUp, Filter } from 'lucide-react';

interface QuickActionsProps {
  onAddWatch: () => void;
  onExport?: () => void;
  onViewDashboard?: () => void;
  onViewInventory?: () => void;
}

export function QuickActions({
  onAddWatch,
  onExport,
  onViewDashboard,
  onViewInventory,
}: QuickActionsProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-3">
          <Button onClick={onAddWatch} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Watch
          </Button>
          {onViewDashboard && (
            <Button variant="secondary" size="sm" onClick={onViewDashboard}>
              <TrendingUp className="h-4 w-4 mr-2" />
              View Dashboard
            </Button>
          )}
          {onViewInventory && (
            <Button variant="secondary" size="sm" onClick={onViewInventory}>
              <Filter className="h-4 w-4 mr-2" />
              View Inventory
            </Button>
          )}
          {onExport && (
            <Button variant="secondary" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
