'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Loader2, X } from 'lucide-react';

interface AddWatchFormProps {
  onSave: (watch: any) => Promise<void>;
  onCancel: () => void;
  initialData?: any;
}

export function AddWatchForm({ onSave, onCancel, initialData }: AddWatchFormProps) {
  const [isScraping, setIsScraping] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
    images: initialData?.images || [] as string[],
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
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: formData.purchasePrice ? parseFloat(formData.purchasePrice.toString()) : null,
          images: formData.images,
          condition: formData.conditionNotes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze watch');
      }

      const analysis = await response.json();
      
      // Update form with AI recommendations
      setFormData((prev) => ({
        ...prev,
        revenueAsIs: analysis.estimatedMarketValue?.asIs || prev.revenueAsIs,
        revenueCleaned: analysis.estimatedMarketValue?.cleaned || prev.revenueCleaned,
        revenueServiced: analysis.estimatedMarketValue?.serviced || prev.revenueServiced,
        conditionNotes: prev.conditionNotes || analysis.explanation,
      }));

      // Show analysis results
      alert(`AI Recommendation: ${analysis.recommendation.toUpperCase()}\n\n${analysis.explanation}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze watch';
      alert(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const watchData = {
      ...formData,
      purchasePrice: parseFloat(formData.purchasePrice.toString()),
      revenueAsIs: formData.revenueAsIs ? parseFloat(formData.revenueAsIs.toString()) : null,
      revenueCleaned: formData.revenueCleaned ? parseFloat(formData.revenueCleaned.toString()) : null,
      revenueServiced: formData.revenueServiced ? parseFloat(formData.revenueServiced.toString()) : null,
      ebayUrl: formData.ebayUrl || null,
    };

    await onSave(watchData);
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_: string, i: number) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {initialData ? 'Edit Watch' : 'Add New Watch'}
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>eBay Listing (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Paste eBay URL here..."
                  value={formData.ebayUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ebayUrl: e.target.value }))}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button
                  type="button"
                  onClick={handleScrape}
                  disabled={isScraping || !formData.ebayUrl}
                >
                  {isScraping ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Scraping...
                    </>
                  ) : (
                    'Scrape Listing'
                  )}
                </Button>
              </div>
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
                    onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.model}
                    onChange={(e) => setFormData((prev) => ({ ...prev, model: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
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
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
                />
              </div>
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
                  onChange={(e) => setFormData((prev) => ({ ...prev, purchasePrice: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
                  disabled={isAnalyzing || !formData.title}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    '🤖 Get AI Analysis & Recommendations'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {formData.images.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  {formData.images.map((imageUrl: string, index: number) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={`Watch image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

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
    </div>
  );
}

