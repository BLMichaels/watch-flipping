'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface CSVImportProps {
  onImport: (watches: any[]) => Promise<void>;
}

export function CSVImport({ onImport }: CSVImportProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<any[] | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError('Please select a CSV file');
      return;
    }

    setIsImporting(true);
    setError(null);
    setPreview(null);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('CSV file must have at least a header row and one data row');
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const watches = lines.slice(1).map((line, index) => {
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const watch: any = {};
        
        headers.forEach((header, i) => {
          const value = values[i] || '';
          const lowerHeader = header.toLowerCase();
          
          if (lowerHeader.includes('brand')) watch.brand = value;
          else if (lowerHeader.includes('model')) watch.model = value;
          else if (lowerHeader.includes('reference')) watch.referenceNumber = value;
          else if (lowerHeader.includes('purchase price')) watch.purchasePrice = parseFloat(value) || 0;
          else if (lowerHeader.includes('purchase date')) watch.purchaseDate = value;
          else if (lowerHeader.includes('revenue') && lowerHeader.includes('as-is')) watch.revenueAsIs = value ? parseFloat(value) : null;
          else if (lowerHeader.includes('revenue') && lowerHeader.includes('cleaned')) watch.revenueCleaned = value ? parseFloat(value) : null;
          else if (lowerHeader.includes('revenue') && lowerHeader.includes('serviced')) watch.revenueServiced = value ? parseFloat(value) : null;
          else if (lowerHeader.includes('status')) watch.status = value || 'needs_service';
          else if (lowerHeader.includes('service cost')) watch.serviceCost = value ? parseFloat(value) : null;
          else if (lowerHeader.includes('cleaning cost')) watch.cleaningCost = value ? parseFloat(value) : null;
          else if (lowerHeader.includes('other cost')) watch.otherCosts = value ? parseFloat(value) : null;
          else if (lowerHeader.includes('sold date')) watch.soldDate = value || null;
          else if (lowerHeader.includes('sold price')) watch.soldPrice = value ? parseFloat(value) : null;
          else if (lowerHeader.includes('tag')) watch.tags = value ? value.split(';').map((t: string) => t.trim()) : [];
          else if (lowerHeader.includes('note')) watch.notes = value || null;
          else if (lowerHeader.includes('favorite')) watch.isFavorite = value?.toLowerCase() === 'yes';
        });

        // Required fields validation
        if (!watch.brand || !watch.model || !watch.purchasePrice) {
          throw new Error(`Row ${index + 2}: Missing required fields (brand, model, or purchase price)`);
        }

        return watch;
      });

      setPreview(watches.slice(0, 5)); // Show first 5 as preview
      
      if (confirm(`Found ${watches.length} watches. Import all?`)) {
        await onImport(watches);
        setPreview(null);
        if (e.target) {
          e.target.value = '';
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to parse CSV file');
      console.error('CSV import error:', err);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Import from CSV
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              disabled={isImporting}
              className="hidden"
              id="csv-import-input"
            />
            <label htmlFor="csv-import-input">
              <Button
                variant="secondary"
                onClick={() => document.getElementById('csv-import-input')?.click()}
                disabled={isImporting}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isImporting ? 'Importing...' : 'Select CSV File'}
              </Button>
            </label>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Import Error</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {preview && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-800 mb-2">Preview (first 5 rows):</p>
              <div className="space-y-1">
                {preview.map((watch, index) => (
                  <p key={index} className="text-sm text-blue-700">
                    {watch.brand} {watch.model} - ${watch.purchasePrice}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500">
            <p className="font-medium mb-1">Expected CSV format:</p>
            <p>Brand, Model, Purchase Price, Purchase Date, Revenue (As-Is), Revenue (Cleaned), Revenue (Serviced), Status, Tags, Notes</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

