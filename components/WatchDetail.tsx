'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { ArrowLeft, Edit, Trash2, Upload, X } from 'lucide-react';

interface Watch {
  id: string;
  brand: string;
  model: string;
  referenceNumber?: string | null;
  title: string;
  description?: string | null;
  purchasePrice: number;
  purchaseDate: string;
  revenueAsIs?: number | null;
  revenueCleaned?: number | null;
  revenueServiced?: number | null;
  status: string;
  conditionNotes?: string | null;
  images: string[];
  ebayUrl?: string | null;
  aiAnalysis?: string | null;
  aiRecommendation?: string | null;
  aiConfidence?: number | null;
}

interface WatchDetailProps {
  watch: Watch;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onImageUpload: (watchId: string, file: File) => Promise<void>;
  onImageDelete: (watchId: string, imageUrl: string) => Promise<void>;
}

export function WatchDetail({
  watch,
  onBack,
  onEdit,
  onDelete,
  onImageUpload,
  onImageDelete,
}: WatchDetailProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await onImageUpload(watch.id, file);
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready_to_sell':
        return 'bg-green-100 text-green-800';
      case 'needs_service':
        return 'bg-yellow-100 text-yellow-800';
      case 'problem_item':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ready_to_sell':
        return 'Ready to Sell';
      case 'needs_service':
        return 'Needs Service';
      case 'problem_item':
        return 'Problem Item';
      default:
        return status;
    }
  };

  const bestRevenue = watch.revenueServiced || watch.revenueCleaned || watch.revenueAsIs || 0;
  const profit = bestRevenue - watch.purchasePrice;
  const roi = watch.purchasePrice > 0 ? (profit / watch.purchasePrice) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{watch.brand} {watch.model}</h1>
              {watch.referenceNumber && (
                <p className="text-gray-600 mt-1">Ref: {watch.referenceNumber}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="danger" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent>
                {watch.images.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No images uploaded yet
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {watch.images.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <div
                          className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
                          onClick={() => setSelectedImage(imageUrl)}
                        >
                          <img
                            src={imageUrl}
                            alt={`${watch.brand} ${watch.model} - Image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          onClick={() => onImageDelete(watch.id, imageUrl)}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4">
                  <label className="inline-block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    <Button variant="secondary" as="span" disabled={uploading}>
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Upload Image'}
                    </Button>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Watch Information */}
            <Card>
              <CardHeader>
                <CardTitle>Watch Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Brand</dt>
                    <dd className="mt-1 text-sm text-gray-900">{watch.brand}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Model</dt>
                    <dd className="mt-1 text-sm text-gray-900">{watch.model}</dd>
                  </div>
                  {watch.referenceNumber && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Reference Number</dt>
                      <dd className="mt-1 text-sm text-gray-900">{watch.referenceNumber}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          watch.status
                        )}`}
                      >
                        {getStatusLabel(watch.status)}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Purchase Price</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      ${watch.purchasePrice.toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Purchase Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(watch.purchaseDate).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
                {watch.description && (
                  <div className="mt-4">
                    <dt className="text-sm font-medium text-gray-500 mb-2">Description</dt>
                    <dd className="text-sm text-gray-900 whitespace-pre-wrap">
                      {watch.description}
                    </dd>
                  </div>
                )}
                {watch.conditionNotes && (
                  <div className="mt-4">
                    <dt className="text-sm font-medium text-gray-500 mb-2">Condition Notes</dt>
                    <dd className="text-sm text-gray-900 whitespace-pre-wrap">
                      {watch.conditionNotes}
                    </dd>
                  </div>
                )}
                {watch.ebayUrl && (
                  <div className="mt-4">
                    <dt className="text-sm font-medium text-gray-500 mb-2">eBay Listing</dt>
                    <dd>
                      <a
                        href={watch.ebayUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View Original Listing
                      </a>
                    </dd>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Purchase Price</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${watch.purchasePrice.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Projected Revenue (Best Case)</p>
                    <p className="text-xl font-bold text-green-600">
                      ${bestRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">Projected Profit</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${profit.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">ROI: {roi.toFixed(1)}%</p>
                  </div>
                  {watch.revenueAsIs && (
                    <div>
                      <p className="text-sm text-gray-600">As-Is: ${watch.revenueAsIs.toLocaleString()}</p>
                    </div>
                  )}
                  {watch.revenueCleaned && (
                    <div>
                      <p className="text-sm text-gray-600">Cleaned: ${watch.revenueCleaned.toLocaleString()}</p>
                    </div>
                  )}
                  {watch.revenueServiced && (
                    <div>
                      <p className="text-sm text-gray-600">Serviced: ${watch.revenueServiced.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* AI Analysis */}
            {watch.aiAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle>AI Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  {watch.aiRecommendation && (
                    <div className="mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          watch.aiRecommendation === 'buy'
                            ? 'bg-green-100 text-green-800'
                            : watch.aiRecommendation === 'pass'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {watch.aiRecommendation.toUpperCase()}
                      </span>
                      {watch.aiConfidence && (
                        <span className="ml-2 text-sm text-gray-600">
                          ({watch.aiConfidence}% confidence)
                        </span>
                      )}
                    </div>
                  )}
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">
                    {typeof watch.aiAnalysis === 'string'
                      ? watch.aiAnalysis
                      : JSON.stringify(watch.aiAnalysis, null, 2)}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Watch detail"
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
}

