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
}

export default function Home() {
  const [view, setView] = useState<View>('dashboard');
  const [watches, setWatches] = useState<Watch[]>([]);
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
      } else {
        alert('Failed to delete watch');
      }
    } catch (error) {
      console.error('Error deleting watch:', error);
      alert('Failed to delete watch');
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
        alert(error.error || 'Failed to save watch');
      }
    } catch (error) {
      console.error('Error saving watch:', error);
      alert('Failed to save watch');
    }
  };

  // Image upload/delete temporarily disabled
  const handleImageUpload = async () => {
    alert('Image upload is temporarily disabled');
  };

  const handleImageDelete = async () => {
    alert('Image deletion is temporarily disabled');
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
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
              } catch (error) {
                console.error('Error updating statuses:', error);
                alert('Failed to update statuses');
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

