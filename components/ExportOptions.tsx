'use client';

import { Button } from './ui/Button';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';

interface Watch {
  [key: string]: any;
}

interface ExportOptionsProps {
  watches: Watch[];
  label?: string;
}

export function ExportOptions({ watches, label = 'Export' }: ExportOptionsProps) {
  const exportToCSV = () => {
    if (watches.length === 0) {
      alert('No watches to export');
      return;
    }

    const headers = [
      'Brand', 'Model', 'Reference Number', 'Purchase Price', 'Purchase Date',
      'Revenue (As-Is)', 'Revenue (Cleaned)', 'Revenue (Serviced)',
      'Status', 'Service Cost', 'Cleaning Cost', 'Other Costs',
      'Sold Date', 'Sold Price', 'Tags', 'Notes', 'Is Favorite'
    ];

    const rows = watches.map(watch => [
      watch.brand || '',
      watch.model || '',
      watch.referenceNumber || '',
      watch.purchasePrice || 0,
      watch.purchaseDate ? new Date(watch.purchaseDate).toLocaleDateString() : '',
      watch.revenueAsIs || '',
      watch.revenueCleaned || '',
      watch.revenueServiced || '',
      watch.status || '',
      watch.serviceCost || '',
      watch.cleaningCost || '',
      watch.otherCosts || '',
      watch.soldDate ? new Date(watch.soldDate).toLocaleDateString() : '',
      watch.soldPrice || '',
      (watch.tags || []).join('; '),
      watch.notes || '',
      watch.isFavorite ? 'Yes' : 'No',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

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

  const exportToJSON = () => {
    if (watches.length === 0) {
      alert('No watches to export');
      return;
    }

    const dataStr = JSON.stringify(watches, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `watch-inventory-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (watches.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">{label}:</span>
      <Button
        variant="secondary"
        size="sm"
        onClick={exportToCSV}
        className="flex items-center gap-1"
      >
        <FileSpreadsheet className="h-4 w-4" />
        CSV
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={exportToJSON}
        className="flex items-center gap-1"
      >
        <FileText className="h-4 w-4" />
        JSON
      </Button>
    </div>
  );
}

