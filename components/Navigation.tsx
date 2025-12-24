'use client';

import { Home, Package, Plus, BarChart3 } from 'lucide-react';
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
                variant={currentView === 'dashboard' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => onNavigate('dashboard')}
                className={currentView === 'dashboard' ? '' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'}
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant={currentView === 'inventory' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => onNavigate('inventory')}
                className={currentView === 'inventory' ? '' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'}
              >
                <Package className="h-4 w-4 mr-2" />
                Inventory
              </Button>
              <Button
                variant={currentView === 'summary' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => onNavigate('summary')}
                className={currentView === 'summary' ? '' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Summary
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

