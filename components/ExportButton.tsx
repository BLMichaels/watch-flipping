'use client';

import { Button } from './ui/Button';
import { Download } from 'lucide-react';

// Flexible Watch interface to work with different component types
interface Watch {
  id: string;
  brand: string;
  purchasePrice: number;
  revenueAsIs: number | null;
  revenueCleaned: number | null;
  revenueServiced: number | null;
  status: string;
  model?: string;
  purchaseDate?: string;
  [key: string]: any; // Allow additional properties
}

interface ExportButtonProps {
  watches: Watch[];
}

export function ExportButton({ watches }: ExportButtonProps) {
  const exportToCSV = () => {
    // CSV headers
    const headers = [
      'Brand',
      'Model',
      'Purchase Price',
      'Revenue (As-Is)',
      'Revenue (Cleaned)',
      'Revenue (Serviced)',
      'Best Profit',
      'ROI %',
      'Status',
      'Purchase Date',
    ];

    // CSV rows
    const rows = watches.map((watch) => {
      const bestRevenue = watch.revenueServiced || watch.revenueCleaned || watch.revenueAsIs || 0;
      const profit = bestRevenue - watch.purchasePrice;
      const roi = watch.purchasePrice > 0 ? (profit / watch.purchasePrice) * 100 : 0;

      return [
        watch.brand,
        watch.model || '',
        watch.purchasePrice.toFixed(2),
        watch.revenueAsIs?.toFixed(2) || '',
        watch.revenueCleaned?.toFixed(2) || '',
        watch.revenueServiced?.toFixed(2) || '',
        profit.toFixed(2),
        roi.toFixed(1),
        watch.status,
        watch.purchaseDate ? new Date(watch.purchaseDate).toLocaleDateString() : '',
      ];
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `watch-inventory-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button variant="secondary" onClick={exportToCSV}>
      <Download className="h-4 w-4 mr-2" />
      Export to CSV
    </Button>
  );
}

