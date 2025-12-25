'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { X, FileText } from 'lucide-react';
import { WatchTemplates } from './WatchTemplates';
import { validateWatchData } from './DataValidation';

interface AddWatchFormProps {
  onSave: (watch: any) => Promise<void>;
  onCancel: () => void;
  initialData?: any;
}

export function AddWatchForm({ onSave, onCancel, initialData }: AddWatchFormProps) {
  const [isScraping, setIsScraping] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTemplates, setShowTemplates] = useState(false);
  const [formData, setFormData] = useState({
    ebayUrl: '',
    brand: initialData?.brand || '',
    model: initialData?.model || '',
    referenceNumber: initialData?.referenceNumber || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    purchasePrice: initialData?.purchasePrice || '',
    revenueAsIs: initialData?.revenueAsIs || '',
    revenueCleaned: initialData?.revenueCleaned || '',
    revenueServiced: initialData?.revenueServiced || '',
    status: initialData?.status || 'needs_service',
    conditionNotes: initialData?.conditionNotes || '',
    notes: initialData?.notes || '',
    tags: initialData?.tags || [] as string[],
    tagsInput: initialData?.tags?.join(', ') || '',
    serviceCost: initialData?.serviceCost || '',
    cleaningCost: initialData?.cleaningCost || '',
    otherCosts: initialData?.otherCosts || '',
    soldPrice: initialData?.soldPrice || '',
    soldDate: initialData?.soldDate ? new Date(initialData.soldDate).toISOString().split('T')[0] : '',
    images: initialData?.images || [] as string[],
    imageUrls: initialData?.imageUrls || '' as string,
  });

  const handleScrape = async () => {
    if (!formData.ebayUrl) return;

    setIsScraping(true);
    try {
      const response = await fetch('/api/ebay-scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formData.ebayUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to scrape eBay listing');
      }

      const data = await response.json();
      
      setFormData((prev) => ({
        ...prev,
        brand: data.brand || prev.brand,
        model: data.model || prev.model,
        referenceNumber: data.referenceNumber || prev.referenceNumber,
        title: data.title || prev.title,
        description: data.description || prev.description,
        images: data.images || prev.images,
      }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to scrape eBay listing';
      alert(errorMessage);
    } finally {
      setIsScraping(false);
    }
  };

  const handleAnalyze = async () => {
    alert('AI analysis is temporarily disabled. Please enter revenue estimates manually.');
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }
    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.purchasePrice || parseFloat(formData.purchasePrice.toString()) <= 0) {
      newErrors.purchasePrice = 'Purchase price must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Use centralized validation
    const validation = validateWatchData(formData);
    if (!validation.isValid) {
      const newErrors: Record<string, string> = {};
      validation.errors.forEach((error) => {
        if (error.includes('Brand')) newErrors.brand = error;
        if (error.includes('Model')) newErrors.model = error;
        if (error.includes('Purchase price')) newErrors.purchasePrice = error;
        if (error.includes('Revenue')) {
          if (error.includes('As-Is')) newErrors.revenueAsIs = error;
          if (error.includes('Cleaned')) newErrors.revenueCleaned = error;
          if (error.includes('Serviced')) newErrors.revenueServiced = error;
        }
        if (error.includes('Service cost')) newErrors.serviceCost = error;
        if (error.includes('Cleaning cost')) newErrors.cleaningCost = error;
        if (error.includes('Other costs')) newErrors.otherCosts = error;
        if (error.includes('Sold price')) newErrors.soldPrice = error;
      });
      setErrors(newErrors);
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    const watchData = {
      ...formData,
      purchasePrice: parseFloat(formData.purchasePrice.toString()),
      revenueAsIs: formData.revenueAsIs ? parseFloat(formData.revenueAsIs.toString()) : null,
      revenueCleaned: formData.revenueCleaned ? parseFloat(formData.revenueCleaned.toString()) : null,
      revenueServiced: formData.revenueServiced ? parseFloat(formData.revenueServiced.toString()) : null,
      ebayUrl: formData.ebayUrl || null,
      notes: formData.notes || null,
      tags: formData.tagsInput ? formData.tagsInput.split(',').map((t: string) => t.trim()).filter((t: string) => t) : [],
      serviceCost: formData.serviceCost ? parseFloat(formData.serviceCost.toString()) : null,
      cleaningCost: formData.cleaningCost ? parseFloat(formData.cleaningCost.toString()) : null,
      otherCosts: formData.otherCosts ? parseFloat(formData.otherCosts.toString()) : null,
      soldPrice: formData.soldPrice ? parseFloat(formData.soldPrice.toString()) : null,
      soldDate: formData.soldDate || null,
    };

    await onSave(watchData);
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_: string, i: number) => i !== index),
    }));
  };

  const handleTemplateSelect = (template: { brand: string; model: string; tags: string[] }) => {
    setFormData((prev) => ({
      ...prev,
      brand: template.brand,
      model: template.model,
      tagsInput: template.tags.join(', '),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {initialData ? 'Edit Watch' : 'Add New Watch'}
            </h1>
            <p className="text-gray-600 mt-1">
              {initialData
                ? 'Update watch information below.'
                : 'Fill in the details below or use a template to get started.'}
            </p>
          </div>
          {!initialData && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowTemplates(true)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Use Template
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>eBay Listing (Optional - Currently Disabled)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="eBay scraping temporarily disabled - use manual entry"
                  value={formData.ebayUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ebayUrl: e.target.value }))}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
                  disabled
                />
                <Button
                  type="button"
                  onClick={handleScrape}
                  disabled={true}
                >
                  Disabled
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                eBay scraping feature is temporarily disabled. Please enter watch details manually.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Watch Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, brand: e.target.value }));
                      if (errors.brand) setErrors((prev) => ({ ...prev, brand: '' }));
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.brand ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.model}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, model: e.target.value }));
                      if (errors.model) setErrors((prev) => ({ ...prev, model: '' }));
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.model ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    value={formData.referenceNumber}
                    onChange={(e) => setFormData((prev) => ({ ...prev, referenceNumber: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                  <option value="needs_service">Needs Service</option>
                  <option value="ready_to_sell">Ready to Sell</option>
                  <option value="problem_item">Problem Item</option>
                  <option value="sold">Sold</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, title: e.target.value }));
                    if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condition Notes
                </label>
                <textarea
                  value={formData.conditionNotes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, conditionNotes: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the condition, any issues, wear, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional notes, reminders, or observations about this watch"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tagsInput}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tagsInput: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., vintage, luxury, sports, investment"
                />
                <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Cost Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Cost
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.serviceCost}
                    onChange={(e) => setFormData((prev) => ({ ...prev, serviceCost: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cleaning Cost
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cleaningCost}
                    onChange={(e) => setFormData((prev) => ({ ...prev, cleaningCost: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Other Costs
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.otherCosts}
                    onChange={(e) => setFormData((prev) => ({ ...prev, otherCosts: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>
              {(() => {
                const totalCosts = (parseFloat(formData.serviceCost?.toString() || '0') || 0) +
                                  (parseFloat(formData.cleaningCost?.toString() || '0') || 0) +
                                  (parseFloat(formData.otherCosts?.toString() || '0') || 0);
                return totalCosts > 0 && (
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-600">Total Additional Costs</p>
                    <p className="text-lg font-bold text-gray-900">${totalCosts.toFixed(2)}</p>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Financial Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.purchasePrice}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, purchasePrice: e.target.value }));
                    if (errors.purchasePrice) setErrors((prev) => ({ ...prev, purchasePrice: '' }));
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.purchasePrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.purchasePrice && <p className="text-red-500 text-sm mt-1">{errors.purchasePrice}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Revenue (As-Is)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.revenueAsIs}
                    onChange={(e) => setFormData((prev) => ({ ...prev, revenueAsIs: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Revenue (Cleaned)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.revenueCleaned}
                    onChange={(e) => setFormData((prev) => ({ ...prev, revenueCleaned: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Revenue (Serviced)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.revenueServiced}
                    onChange={(e) => setFormData((prev) => ({ ...prev, revenueServiced: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAnalyze}
                  disabled={true}
                >
                  AI Analysis (Disabled)
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  AI analysis is temporarily disabled. Please enter revenue estimates manually.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Image URLs (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paste image URLs (one per line)
                </label>
                <textarea
                  value={formData.imageUrls}
                  onChange={(e) => {
                    const urls = e.target.value.split('\n').filter(url => url.trim());
                    setFormData((prev) => ({ 
                      ...prev, 
                      imageUrls: e.target.value,
                      images: urls
                    }));
                  }}
                  rows={4}
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Enter image URLs, one per line. These will be saved with the watch.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" size="lg">
              {initialData ? 'Update Watch' : 'Add Watch'}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel} size="lg">
              Cancel
            </Button>
          </div>
        </form>
      </div>
      {showTemplates && (
        <WatchTemplates
          onSelectTemplate={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
}

