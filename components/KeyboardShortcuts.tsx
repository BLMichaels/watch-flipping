'use client';

import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onAddWatch?: () => void;
  onViewInventory?: () => void;
  onViewDashboard?: () => void;
  onSearch?: () => void;
}

export function KeyboardShortcuts({
  onAddWatch,
  onViewInventory,
  onViewDashboard,
  onSearch,
}: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onSearch?.();
        return;
      }

      // Ctrl/Cmd + N for new watch
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        onAddWatch?.();
        return;
      }

      // Ctrl/Cmd + 1 for dashboard
      if ((e.ctrlKey || e.metaKey) && e.key === '1') {
        e.preventDefault();
        onViewDashboard?.();
        return;
      }

      // Ctrl/Cmd + 2 for inventory
      if ((e.ctrlKey || e.metaKey) && e.key === '2') {
        e.preventDefault();
        onViewInventory?.();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onAddWatch, onViewInventory, onViewDashboard, onSearch]);

  return null; // This component doesn't render anything
}

