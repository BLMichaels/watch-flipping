'use client';

import { useState, useEffect } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { InventoryList } from '@/components/InventoryList';
import { WatchDetail } from '@/components/WatchDetail';
import { AddWatchForm } from '@/components/AddWatchForm';
import { Navigation } from '@/components/Navigation';
import { SummaryReport } from '@/components/SummaryReport';
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts';
import { useToast, ToastContainer } from '@/components/Toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';

type View = 'dashboard' | 'inventory' | 'watch-detail' | 'add-watch' | 'edit-watch' | 'summary';

interface Watch {
  id: string;
  brand: string;
  model: string;
  referenceNumber?: string | null;
  title: string;
  description?: string | null;
  purchasePrice: number;
  purchaseDate: string;
  revenueAsIs: number | null;
  revenueCleaned: number | null;
  revenueServiced: number | null;
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
  ebayListingId?: string | null;
  aiAnalysis?: string | null;
  aiRecommendation?: string | null;
  aiConfidence?: number | null;
  isFavorite?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function Home() {
  const [view, setView] = useState<View>('dashboard');
  const [watches, setWatches] = useState<Watch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWatch, setSelectedWatch] = useState<Watch | null>(null);
  const [loading, setLoading] = useState(true);
  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => {
    fetchWatches();
  }, []);

  const fetchWatches = async () => {
    try {
      const response = await fetch('/api/watches');
      if (response.ok) {
        const data = await response.json();
        setWatches(data);
      }
    } catch (error) {
      console.error('Error fetching watches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWatch = () => {
    setSelectedWatch(null);
    setView('add-watch');
  };

  const handleViewInventory = () => {
    setView('inventory');
  };

  const handleViewWatch = async (id: string) => {
    try {
      const response = await fetch(`/api/watches/${id}`);
      if (response.ok) {
        const watch = await response.json();
        setSelectedWatch(watch);
        setView('watch-detail');
      }
    } catch (error) {
      console.error('Error fetching watch:', error);
    }
  };

  const handleEditWatch = async (id: string) => {
    try {
      const response = await fetch(`/api/watches/${id}`);
      if (response.ok) {
        const watch = await response.json();
        setSelectedWatch(watch);
        setView('edit-watch');
      }
    } catch (error) {
      console.error('Error fetching watch:', error);
    }
  };

  const handleDeleteWatch = async (id: string) => {
    if (!confirm('Are you sure you want to delete this watch?')) {
      return;
    }

    try {
      const response = await fetch(`/api/watches/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setWatches((prev) => prev.filter((w) => w.id !== id));
        if (selectedWatch?.id === id) {
          setView('inventory');
          setSelectedWatch(null);
        }
        showToast('Watch deleted successfully', 'success');
      } else {
        showToast('Failed to delete watch', 'error');
      }
    } catch (error) {
      console.error('Error deleting watch:', error);
      showToast('Failed to delete watch', 'error');
    }
  };

  const handleSaveWatch = async (watchData: any) => {
    try {
      const url = selectedWatch ? `/api/watches/${selectedWatch.id}` : '/api/watches';
      const method = selectedWatch ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(watchData),
      });

      if (response.ok) {
        await fetchWatches();
        setView('inventory');
        setSelectedWatch(null);
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to save watch', 'error');
      }
    } catch (error) {
      console.error('Error saving watch:', error);
      showToast('Failed to save watch', 'error');
    }
  };

  const handleImageUpload = async (watchId: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/watches/${watchId}/images`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        // Update the watch in state
        setWatches((prev) =>
          prev.map((w) =>
            w.id === watchId
              ? { ...w, images: [...w.images, data.imageUrl] }
              : w
          )
        );
        // Update selected watch if it's the one being edited
        if (selectedWatch?.id === watchId) {
          setSelectedWatch((prev) =>
            prev
              ? { ...prev, images: [...prev.images, data.imageUrl] }
              : null
          );
        }
        showToast('Image uploaded successfully', 'success');
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to upload image', 'error');
        throw new Error(error.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleImageDelete = async (watchId: string, imageUrl: string) => {
    try {
      const response = await fetch(
        `/api/watches/${watchId}/images?imageUrl=${encodeURIComponent(imageUrl)}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        // Update the watch in state
        setWatches((prev) =>
          prev.map((w) =>
            w.id === watchId
              ? { ...w, images: w.images.filter((img) => img !== imageUrl) }
              : w
          )
        );
        // Update selected watch if it's the one being edited
        if (selectedWatch?.id === watchId) {
          setSelectedWatch((prev) =>
            prev
              ? { ...prev, images: prev.images.filter((img) => img !== imageUrl) }
              : null
          );
        }
        showToast('Image deleted successfully', 'success');
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to delete image', 'error');
        throw new Error(error.error || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  };

  const handleToggleFavorite = async (watchId: string, isFavorite: boolean) => {
    try {
      const response = await fetch(`/api/watches/${watchId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite }),
      });

      if (response.ok) {
        await fetchWatches();
        showToast(isFavorite ? 'Added to favorites' : 'Removed from favorites', 'success');
      } else {
        showToast('Failed to update favorite status', 'error');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showToast('Failed to update favorite status', 'error');
    }
  };

  const handleStatusChange = async (watchId: string, status: string) => {
    try {
      const watch = watches.find(w => w.id === watchId);
      if (!watch) return;

      const response = await fetch(`/api/watches/${watchId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...watch,
          status,
        }),
      });

      if (response.ok) {
        await fetchWatches();
        if (selectedWatch?.id === watchId) {
          const watchResponse = await fetch(`/api/watches/${watchId}`);
          if (watchResponse.ok) {
            const updatedWatch = await watchResponse.json();
            setSelectedWatch(updatedWatch);
          }
        }
        showToast('Status updated successfully', 'success');
      } else {
        showToast('Failed to update status', 'error');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Failed to update status', 'error');
    }
  };

  const handleAnalyzeWatch = async (id: string) => {
    alert('AI analysis is temporarily disabled');
  };

  // AI analysis temporarily disabled

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your watch collection..." fullScreen />
      </div>
    );
  }

  if (loading) {
    return <LoadingState message="Loading your watch inventory..." fullScreen />;
  }

  return (
    <div>
      <KeyboardShortcuts
        onAddWatch={handleAddWatch}
        onViewInventory={handleViewInventory}
        onViewDashboard={() => setView('dashboard')}
      />
      <Navigation
        currentView={view}
        onNavigate={(newView) => {
          if (newView === 'dashboard') {
            setView('dashboard');
          } else if (newView === 'inventory') {
            setView('inventory');
          } else if (newView === 'summary') {
            setView('summary');
          } else if (newView === 'add-watch') {
            handleAddWatch();
          }
        }}
      />
      {view === 'dashboard' && (
        <Dashboard
          watches={watches}
          onAddWatch={handleAddWatch}
          onViewInventory={handleViewInventory}
          onExport={() => {
            // Export functionality handled by ExportButton
          }}
        />
      )}

      {view === 'inventory' && (
        <div>
          <InventoryList
            watches={watches}
            onViewWatch={handleViewWatch}
            onEditWatch={handleEditWatch}
            onDeleteWatch={handleDeleteWatch}
            onAnalyzeWatch={handleAnalyzeWatch}
            onBulkStatusUpdate={async (ids, status) => {
              try {
                await Promise.all(ids.map(id => {
                  const watch = watches.find(w => w.id === id);
                  if (!watch) return Promise.resolve();
                  return fetch(`/api/watches/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...watch, status }),
                  });
                }));
                await fetchWatches();
                showToast(`${ids.length} watch(es) updated successfully`, 'success');
              } catch (error) {
                console.error('Error updating statuses:', error);
                showToast('Failed to update statuses', 'error');
              }
            }}
            onBulkDelete={async (ids) => {
              try {
                await Promise.all(ids.map(id => 
                  fetch(`/api/watches/${id}`, { method: 'DELETE' })
                ));
                await fetchWatches();
                showToast(`${ids.length} watch(es) deleted successfully`, 'success');
              } catch (error) {
                console.error('Error deleting watches:', error);
                showToast('Failed to delete watches', 'error');
              }
            }}
            onAddWatch={handleAddWatch}
          />
          <div className="fixed bottom-6 right-6">
            <button
              onClick={handleAddWatch}
              className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors"
            >
              <span className="text-2xl">+</span>
            </button>
          </div>
        </div>
      )}

      {view === 'watch-detail' && selectedWatch && (
        <div>
          <WatchDetail
            watch={selectedWatch}
            onBack={() => setView('inventory')}
            onEdit={() => handleEditWatch(selectedWatch.id)}
            onDelete={() => handleDeleteWatch(selectedWatch.id)}
            onImageUpload={handleImageUpload}
            onImageDelete={handleImageDelete}
            onStatusChange={handleStatusChange}
          />
        </div>
      )}

      {(view === 'add-watch' || view === 'edit-watch') && (view === 'add-watch' || selectedWatch) && (
        <AddWatchForm
          onSave={handleSaveWatch}
          onCancel={() => {
            setView('inventory');
            setSelectedWatch(null);
          }}
          initialData={selectedWatch || undefined}
        />
      )}

      {view === 'summary' && (
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <SummaryReport watches={watches} />
          </div>
        </div>
      )}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

