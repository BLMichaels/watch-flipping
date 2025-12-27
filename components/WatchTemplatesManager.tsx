'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Save, Trash2, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';

interface WatchTemplate {
  id: string;
  name: string;
  brand: string;
  model?: string;
  referenceNumber?: string;
  defaultPurchasePrice?: number;
  defaultServiceCost?: number;
  defaultCleaningCost?: number;
  tags?: string[];
  notes?: string;
}

interface WatchTemplatesManagerProps {
  onSelectTemplate: (template: WatchTemplate) => void;
}

export function WatchTemplatesManager({ onSelectTemplate }: WatchTemplatesManagerProps) {
  const [templates, setTemplates] = useState<WatchTemplate[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('watchTemplates');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WatchTemplate | null>(null);
  const [formData, setFormData] = useState<WatchTemplate>({
    id: '',
    name: '',
    brand: '',
    model: '',
    referenceNumber: '',
    defaultPurchasePrice: 0,
    defaultServiceCost: 0,
    defaultCleaningCost: 0,
    tags: [],
    notes: '',
  });

  const saveTemplate = () => {
    if (!formData.name || !formData.brand) return;

    const template: WatchTemplate = {
      ...formData,
      id: editingTemplate?.id || Date.now().toString(),
    };

    let updated: WatchTemplate[];
    if (editingTemplate) {
      updated = templates.map(t => t.id === editingTemplate.id ? template : t);
    } else {
      updated = [...templates, template];
    }

    setTemplates(updated);
    localStorage.setItem('watchTemplates', JSON.stringify(updated));
    
    setShowAddForm(false);
    setEditingTemplate(null);
    setFormData({
      id: '',
      name: '',
      brand: '',
      model: '',
      referenceNumber: '',
      defaultPurchasePrice: 0,
      defaultServiceCost: 0,
      defaultCleaningCost: 0,
      tags: [],
      notes: '',
    });
  };

  const deleteTemplate = (id: string) => {
    const updated = templates.filter(t => t.id !== id);
    setTemplates(updated);
    localStorage.setItem('watchTemplates', JSON.stringify(updated));
  };

  const editTemplate = (template: WatchTemplate) => {
    setEditingTemplate(template);
    setFormData(template);
    setShowAddForm(true);
  };

  if (templates.length === 0 && !showAddForm) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Watch Templates</CardTitle>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create Template
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">No templates saved. Create templates to quickly add common watch types.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Watch Templates</CardTitle>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingTemplate(null);
              setFormData({
                id: '',
                name: '',
                brand: '',
                model: '',
                referenceNumber: '',
                defaultPurchasePrice: 0,
                defaultServiceCost: 0,
                defaultCleaningCost: 0,
                tags: [],
                notes: '',
              });
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            {showAddForm ? 'Cancel' : 'Create Template'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showAddForm && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Rolex Submariner"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand *
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Rolex"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="Submariner"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference Number
              </label>
              <input
                type="text"
                value={formData.referenceNumber}
                onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                placeholder="126610LN"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Purchase Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.defaultPurchasePrice}
                  onChange={(e) => setFormData({ ...formData, defaultPurchasePrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Service Cost
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.defaultServiceCost}
                  onChange={(e) => setFormData({ ...formData, defaultServiceCost: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Cleaning Cost
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.defaultCleaningCost}
                  onChange={(e) => setFormData({ ...formData, defaultCleaningCost: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags?.join(', ') || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                })}
                placeholder="luxury, dive, automatic"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button
              variant="primary"
              onClick={saveTemplate}
              disabled={!formData.name || !formData.brand}
            >
              <Save className="h-4 w-4 mr-1" />
              {editingTemplate ? 'Update Template' : 'Save Template'}
            </Button>
          </div>
        )}

        <div className="space-y-2">
          {templates.map(template => (
            <div
              key={template.id}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm">{template.name}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {template.brand} {template.model || ''} {template.referenceNumber || ''}
                  </p>
                  {template.tags && template.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onSelectTemplate(template)}
                  >
                    Use
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => editTemplate(template)}
                  >
                    Edit
                  </Button>
                  <button
                    onClick={() => deleteTemplate(template.id)}
                    className="p-1 rounded text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

