'use client';

import { Home, Package, Plus } from 'lucide-react';
import { Button } from './ui/Button';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Navigation({ currentView, onNavigate }: NavigationProps) {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-gray-900">Watch Flipping Manager</h1>
            <div className="flex items-center gap-2">
              <Button
                variant={currentView === 'dashboard' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('dashboard')}
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant={currentView === 'inventory' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('inventory')}
              >
                <Package className="h-4 w-4 mr-2" />
                Inventory
              </Button>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => onNavigate('add-watch')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Watch
          </Button>
        </div>
      </div>
    </nav>
  );
}

