'use client';

import { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { ArrowLeft, Edit, Trash2, X, Upload } from 'lucide-react';
import { QuickStatusUpdate } from './QuickStatusUpdate';
import { WatchHistory } from './WatchHistory';
import { ConditionAssessment } from './ConditionAssessment';

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
  notes?: string | null;
  tags?: string[];
  serviceCost?: number | null;
  cleaningCost?: number | null;
  otherCosts?: number | null;
  soldDate?: string | null;
  soldPrice?: number | null;
  images: string[];
  ebayUrl?: string | null;
  aiAnalysis?: string | null;
  aiRecommendation?: string | null;
  aiConfidence?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

interface WatchDetailProps {
  watch: Watch;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onImageUpload: (watchId: string, file: File) => Promise<void>;
  onImageDelete: (watchId: string, imageUrl: string) => Promise<void>;
  onStatusChange?: (watchId: string, status: string) => Promise<void>;
  onConditionUpdate?: (watchId: string, condition: string) => Promise<void>;
}

export function WatchDetail({
  watch,
  onBack,
  onEdit,
  onDelete,
  onImageUpload,
  onImageDelete,
  onStatusChange,
  onConditionUpdate,
}: WatchDetailProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('Image file size must be less than 10MB');
      return;
    }

    setUploading(true);
    try {
      await onImageUpload(watch.id, file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    setDeleting(imageUrl);
    try {
      await onImageDelete(watch.id, imageUrl);
      if (selectedImage === imageUrl) {
        setSelectedImage(null);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image. Please try again.');
    } finally {
      setDeleting(null);
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
      case 'sold':
        return 'bg-blue-100 text-blue-800';
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
      case 'sold':
        return 'Sold';
      default:
        return status;
    }
  };

  const bestRevenue = watch.revenueServiced || watch.revenueCleaned || watch.revenueAsIs || 0;
  const totalCosts = watch.purchasePrice + 
                     (watch.serviceCost || 0) + 
                     (watch.cleaningCost || 0) + 
                     (watch.otherCosts || 0);
  const profit = bestRevenue - totalCosts;
  const roi = totalCosts > 0 ? (profit / totalCosts) * 100 : 0;

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
              <div className="flex items-center gap-3 mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    watch.status
                  )}`}
                >
                  {getStatusLabel(watch.status)}
                </span>
                {watch.purchaseDate && (
                  <span className="text-sm text-gray-500">
                    Purchased: {new Date(watch.purchaseDate).toLocaleDateString()}
                  </span>
                )}
              </div>
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
                    {watch.images.map((imageUrl: string, index: number) => (
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
                          onClick={() => handleDeleteImage(imageUrl)}
                          disabled={deleting === imageUrl}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
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
                {watch.notes && (
                  <div className="mt-4">
                    <dt className="text-sm font-medium text-gray-500 mb-2">Notes</dt>
                    <dd className="text-sm text-gray-900 whitespace-pre-wrap">
                      {watch.notes}
                    </dd>
                  </div>
                )}
                {watch.tags && watch.tags.length > 0 && (
                  <div className="mt-4">
                    <dt className="text-sm font-medium text-gray-500 mb-2">Tags</dt>
                    <dd className="flex flex-wrap gap-2">
                      {watch.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
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
            {/* Quick Status Update */}
            {onStatusChange && (
              <Card>
                <CardHeader>
                  <CardTitle>Quick Status Update</CardTitle>
                </CardHeader>
                <CardContent>
                  <QuickStatusUpdate
                    currentStatus={watch.status}
                    onStatusChange={(status) => onStatusChange(watch.id, status)}
                  />
                </CardContent>
              </Card>
            )}

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
                  {(watch.serviceCost || watch.cleaningCost || watch.otherCosts) && (
                    <div>
                      <p className="text-sm text-gray-600">Additional Costs</p>
                      <div className="text-sm text-gray-700 space-y-1">
                        {watch.serviceCost && <div>Service: ${watch.serviceCost.toLocaleString()}</div>}
                        {watch.cleaningCost && <div>Cleaning: ${watch.cleaningCost.toLocaleString()}</div>}
                        {watch.otherCosts && <div>Other: ${watch.otherCosts.toLocaleString()}</div>}
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mt-2">
                        Total Cost: ${totalCosts.toLocaleString()}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Projected Revenue (Best Case)</p>
                    <p className="text-xl font-bold text-green-600">
                      ${bestRevenue.toLocaleString()}
                    </p>
                  </div>
                  {watch.soldPrice && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Sold Price</p>
                      <p className="text-xl font-bold text-green-600">
                        ${watch.soldPrice.toLocaleString()}
                      </p>
                      {watch.soldDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          Sold: {new Date(watch.soldDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
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

            {/* Image Lightbox Modal */}
            {selectedImage && (
              <div
                className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedImage(null)}
              >
                <div className="relative max-w-4xl max-h-full">
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
                  >
                    <X className="h-6 w-6" />
                  </button>
                  <img
                    src={selectedImage}
                    alt={`${watch.brand} ${watch.model}`}
                    className="max-w-full max-h-[90vh] object-contain rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}

            {/* AI Analysis - Temporarily disabled */}
          </div>

            {/* Condition Assessment */}
            {onConditionUpdate && (
              <div className="lg:col-span-1">
                <ConditionAssessment
                  conditionNotes={watch.conditionNotes}
                  status={watch.status}
                  onUpdateCondition={async (assessment) => {
                    await onConditionUpdate(watch.id, assessment);
                  }}
                />
              </div>
            )}

            {/* History */}
          <div className="lg:col-span-1">
            <WatchHistory
              watchId={watch.id}
              createdAt={watch.createdAt}
              updatedAt={watch.updatedAt}
              purchaseDate={watch.purchaseDate}
              soldDate={watch.soldDate}
              status={watch.status}
              purchasePrice={watch.purchasePrice}
              soldPrice={watch.soldPrice}
            />
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

