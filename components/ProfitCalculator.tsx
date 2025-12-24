'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Calculator } from 'lucide-react';
import { useState } from 'react';

export function ProfitCalculator() {
  const [purchasePrice, setPurchasePrice] = useState('');
  const [serviceCost, setServiceCost] = useState('');
  const [cleaningCost, setCleaningCost] = useState('');
  const [otherCosts, setOtherCosts] = useState('');
  const [revenue, setRevenue] = useState('');

  const totalCost = (parseFloat(purchasePrice) || 0) +
                   (parseFloat(serviceCost) || 0) +
                   (parseFloat(cleaningCost) || 0) +
                   (parseFloat(otherCosts) || 0);
  const profit = (parseFloat(revenue) || 0) - totalCost;
  const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;
  const margin = (parseFloat(revenue) || 0) > 0 ? (profit / parseFloat(revenue)) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-blue-600" />
          <CardTitle>Profit Calculator</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Price
            </label>
            <input
              type="number"
              step="0.01"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Cost
              </label>
              <input
                type="number"
                step="0.01"
                value={serviceCost}
                onChange={(e) => setServiceCost(e.target.value)}
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
                value={cleaningCost}
                onChange={(e) => setCleaningCost(e.target.value)}
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
                value={otherCosts}
                onChange={(e) => setOtherCosts(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Projected Revenue
            </label>
            <input
              type="number"
              step="0.01"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
          <div className="pt-4 border-t border-gray-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Cost</span>
              <span className="text-sm font-semibold text-gray-900">
                ${totalCost.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Projected Profit</span>
              <span className={`text-sm font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${profit.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">ROI</span>
              <span className={`text-sm font-semibold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {roi.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Profit Margin</span>
              <span className={`text-sm font-semibold ${margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {margin.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

