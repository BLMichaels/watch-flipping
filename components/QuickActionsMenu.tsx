'use client';

import { Button } from './ui/Button';
import { Plus, FileDown, Search, BarChart3, Settings, X } from 'lucide-react';
import { useState } from 'react';

interface QuickActionsMenuProps {
  onAddWatch?: () => void;
  onExport?: () => void;
  onViewInventory?: () => void;
  onViewDashboard?: () => void;
  onViewSettings?: () => void;
}

export function QuickActionsMenu({
  onAddWatch,
  onExport,
  onViewInventory,
  onViewDashboard,
  onViewSettings,
}: QuickActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      label: 'Add Watch',
      icon: Plus,
      onClick: onAddWatch,
      variant: 'primary' as const,
    },
    {
      label: 'Export Data',
      icon: FileDown,
      onClick: onExport,
      variant: 'secondary' as const,
    },
    {
      label: 'View Inventory',
      icon: Search,
      onClick: onViewInventory,
      variant: 'secondary' as const,
    },
    {
      label: 'View Dashboard',
      icon: BarChart3,
      onClick: onViewDashboard,
      variant: 'secondary' as const,
    },
    {
      label: 'Settings',
      icon: Settings,
      onClick: onViewSettings,
      variant: 'secondary' as const,
    },
  ].filter(action => action.onClick);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Quick Actions"
      >
        <Plus className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-[200px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Quick Actions</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-2">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant={action.variant}
                onClick={() => {
                  action.onClick?.();
                  setIsOpen(false);
                }}
                className="w-full justify-start"
                size="sm"
              >
                <Icon className="h-4 w-4 mr-2" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
