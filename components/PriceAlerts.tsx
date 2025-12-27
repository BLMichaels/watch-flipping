'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Bell, BellOff, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Watch {
  id: string;
  brand: string;
  model?: string;
  purchasePrice: number;
  revenueServiced?: number | null;
  revenueCleaned?: number | null;
  revenueAsIs?: number | null;
  status: string;
}

interface PriceAlert {
  watchId: string;
  targetProfit: number;
  targetPrice: number;
  isActive: boolean;
}

interface PriceAlertsProps {
  watches: Watch[];
  onAlertTriggered?: (watchId: string, message: string) => void;
}

export function PriceAlerts({ watches, onAlertTriggered }: PriceAlertsProps) {
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('priceAlerts');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [showAddAlert, setShowAddAlert] = useState(false);
  const [selectedWatch, setSelectedWatch] = useState('');
  const [targetProfit, setTargetProfit] = useState('');
  const [targetPrice, setTargetPrice] = useState('');

  // Check alerts
  const checkAlerts = () => {
    alerts.forEach(alert => {
      if (!alert.isActive) return;
      
      const watch = watches.find(w => w.id === alert.watchId);
      if (!watch) return;

      const bestRevenue = watch.revenueServiced || watch.revenueCleaned || watch.revenueAsIs || 0;
      const currentProfit = bestRevenue - watch.purchasePrice;
      
      if (alert.targetProfit && currentProfit >= alert.targetProfit) {
        onAlertTriggered?.(alert.watchId, 
          `${watch.brand} ${watch.model || ''} has reached target profit of $${alert.targetProfit}!`
        );
      }
      
      if (alert.targetPrice && bestRevenue >= alert.targetPrice) {
        onAlertTriggered?.(alert.watchId,
          `${watch.brand} ${watch.model || ''} has reached target price of $${alert.targetPrice}!`
        );
      }
    });
  };

  // Check alerts periodically
  useState(() => {
    const interval = setInterval(checkAlerts, 60000); // Check every minute
    return () => clearInterval(interval);
  });

  const addAlert = () => {
    if (!selectedWatch || (!targetProfit && !targetPrice)) return;

    const newAlert: PriceAlert = {
      watchId: selectedWatch,
      targetProfit: targetProfit ? parseFloat(targetProfit) : 0,
      targetPrice: targetPrice ? parseFloat(targetPrice) : 0,
      isActive: true,
    };

    const updated = [...alerts, newAlert];
    setAlerts(updated);
    localStorage.setItem('priceAlerts', JSON.stringify(updated));
    
    setShowAddAlert(false);
    setSelectedWatch('');
    setTargetProfit('');
    setTargetPrice('');
  };

  const toggleAlert = (index: number) => {
    const updated = alerts.map((alert, i) => 
      i === index ? { ...alert, isActive: !alert.isActive } : alert
    );
    setAlerts(updated);
    localStorage.setItem('priceAlerts', JSON.stringify(updated));
  };

  const removeAlert = (index: number) => {
    const updated = alerts.filter((_, i) => i !== index);
    setAlerts(updated);
    localStorage.setItem('priceAlerts', JSON.stringify(updated));
  };

  const activeAlerts = alerts.filter(a => a.isActive);

  if (alerts.length === 0 && !showAddAlert) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Price Alerts
            </CardTitle>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowAddAlert(true)}
            >
              Add Alert
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">No price alerts set. Create alerts to be notified when watches reach target prices or profits.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Price Alerts ({activeAlerts.length} active)
          </CardTitle>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowAddAlert(!showAddAlert)}
          >
            {showAddAlert ? 'Cancel' : 'Add Alert'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showAddAlert && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Watch
              </label>
              <select
                value={selectedWatch}
                onChange={(e) => setSelectedWatch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a watch</option>
                {watches.map(watch => (
                  <option key={watch.id} value={watch.id}>
                    {watch.brand} {watch.model || ''} - ${watch.purchasePrice}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Profit ($)
                </label>
                <input
                  type="number"
                  value={targetProfit}
                  onChange={(e) => setTargetProfit(e.target.value)}
                  placeholder="e.g., 500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Price ($)
                </label>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="e.g., 2000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <Button
              variant="primary"
              onClick={addAlert}
              disabled={!selectedWatch || (!targetProfit && !targetPrice)}
            >
              Create Alert
            </Button>
          </div>
        )}

        <div className="space-y-2">
          {alerts.map((alert, index) => {
            const watch = watches.find(w => w.id === alert.watchId);
            if (!watch) return null;

            const bestRevenue = watch.revenueServiced || watch.revenueCleaned || watch.revenueAsIs || 0;
            const currentProfit = bestRevenue - watch.purchasePrice;

            return (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  alert.isActive ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {watch.brand} {watch.model || ''}
                    </p>
                    <div className="mt-1 space-y-1 text-xs text-gray-600">
                      {alert.targetProfit > 0 && (
                        <p>
                          Target Profit: ${alert.targetProfit} | Current: ${currentProfit.toFixed(2)}
                          {currentProfit >= alert.targetProfit && (
                            <span className="ml-2 text-green-600 font-semibold">✓ Reached!</span>
                          )}
                        </p>
                      )}
                      {alert.targetPrice > 0 && (
                        <p>
                          Target Price: ${alert.targetPrice} | Current: ${bestRevenue.toFixed(2)}
                          {bestRevenue >= alert.targetPrice && (
                            <span className="ml-2 text-green-600 font-semibold">✓ Reached!</span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleAlert(index)}
                      className={`p-1 rounded ${
                        alert.isActive ? 'text-blue-600' : 'text-gray-400'
                      }`}
                    >
                      {alert.isActive ? (
                        <Bell className="h-4 w-4" />
                      ) : (
                        <BellOff className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => removeAlert(index)}
                      className="p-1 rounded text-gray-400 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

