'use client';

import { useEffect } from 'react';

interface KeyboardNavigationProps {
  onAddWatch?: () => void;
  onSearch?: () => void;
  onDashboard?: () => void;
  onInventory?: () => void;
  onEscape?: () => void;
  enabled?: boolean;
}

export function useKeyboardNavigation({
  onAddWatch,
  onSearch,
  onDashboard,
  onInventory,
  onEscape,
  enabled = true,
}: KeyboardNavigationProps) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

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
        onDashboard?.();
        return;
      }

      // Ctrl/Cmd + 2 for inventory
      if ((e.ctrlKey || e.metaKey) && e.key === '2') {
        e.preventDefault();
        onInventory?.();
        return;
      }

      // Escape key
      if (e.key === 'Escape') {
        onEscape?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onAddWatch, onSearch, onDashboard, onInventory, onEscape]);
}

