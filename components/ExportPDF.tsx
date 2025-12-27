'use client';

import { Button } from './ui/Button';
import { FileText } from 'lucide-react';

interface Watch {
  id: string;
  brand?: string;
  model?: string;
  purchasePrice: number;
  revenueServiced?: number | null;
  revenueCleaned?: number | null;
  revenueAsIs?: number | null;
  status?: string;
  purchaseDate?: string;
  [key: string]: any;
}

interface ExportPDFProps {
  watches: Watch[];
  label?: string;
}

export function ExportPDF({ watches, label = 'Export to PDF' }: ExportPDFProps) {
  const handleExport = () => {
    // Create a simple HTML table for PDF generation
    const tableRows = watches.map((watch) => {
      const bestRevenue = watch.revenueServiced || watch.revenueCleaned || watch.revenueAsIs || 0;
      const profit = bestRevenue - watch.purchasePrice;
      const roi = watch.purchasePrice > 0 ? ((profit / watch.purchasePrice) * 100).toFixed(1) : '0';

      return `
        <tr>
          <td>${watch.brand || 'N/A'}</td>
          <td>${watch.model || 'N/A'}</td>
          <td>$${watch.purchasePrice.toLocaleString()}</td>
          <td>$${bestRevenue.toLocaleString()}</td>
          <td>$${profit.toLocaleString()}</td>
          <td>${roi}%</td>
          <td>${watch.status?.replace('_', ' ') || 'N/A'}</td>
        </tr>
      `;
    }).join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Watch Inventory Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .summary { margin-top: 20px; padding: 15px; background-color: #f0f0f0; border-radius: 5px; }
          </style>
        </head>
        <body>
          <h1>Watch Inventory Report</h1>
          <p>Generated: ${new Date().toLocaleString()}</p>
          <p>Total Watches: ${watches.length}</p>
          <table>
            <thead>
              <tr>
                <th>Brand</th>
                <th>Model</th>
                <th>Purchase Price</th>
                <th>Best Revenue</th>
                <th>Profit</th>
                <th>ROI %</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <div class="summary">
            <h2>Summary</h2>
            <p>Total Investment: $${watches.reduce((sum, w) => sum + w.purchasePrice, 0).toLocaleString()}</p>
            <p>Total Projected Value: $${watches.reduce((sum, w) => {
              const best = w.revenueServiced || w.revenueCleaned || w.revenueAsIs || 0;
              return sum + best;
            }, 0).toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    // Open in new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      // Wait a bit for content to load, then print
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  return (
    <Button variant="secondary" size="sm" onClick={handleExport}>
      <FileText className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
}

