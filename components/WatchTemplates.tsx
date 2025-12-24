'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Watch } from 'lucide-react';

interface WatchTemplate {
  id: string;
  name: string;
  brand: string;
  model: string;
  description: string;
  typicalPriceRange: string;
  tags: string[];
}

const templates: WatchTemplate[] = [
  {
    id: 'rolex-submariner',
    name: 'Rolex Submariner',
    brand: 'Rolex',
    model: 'Submariner',
    description: 'Classic dive watch, highly sought after',
    typicalPriceRange: '$8,000 - $15,000',
    tags: ['luxury', 'dive', 'investment', 'vintage'],
  },
  {
    id: 'omega-speedmaster',
    name: 'Omega Speedmaster',
    brand: 'Omega',
    model: 'Speedmaster',
    description: 'Moonwatch, iconic chronograph',
    typicalPriceRange: '$3,000 - $8,000',
    tags: ['luxury', 'chronograph', 'space', 'vintage'],
  },
  {
    id: 'seiko-5',
    name: 'Seiko 5',
    brand: 'Seiko',
    model: '5',
    description: 'Affordable automatic, great entry point',
    typicalPriceRange: '$100 - $500',
    tags: ['affordable', 'automatic', 'entry-level'],
  },
  {
    id: 'tudor-black-bay',
    name: 'Tudor Black Bay',
    brand: 'Tudor',
    model: 'Black Bay',
    description: 'Heritage dive watch, Rolex sibling brand',
    typicalPriceRange: '$2,500 - $5,000',
    tags: ['luxury', 'dive', 'heritage'],
  },
  {
    id: 'casio-g-shock',
    name: 'Casio G-Shock',
    brand: 'Casio',
    model: 'G-Shock',
    description: 'Durable digital watch, popular with collectors',
    typicalPriceRange: '$50 - $500',
    tags: ['digital', 'durable', 'affordable', 'collectible'],
  },
];

interface WatchTemplatesProps {
  onSelectTemplate: (template: WatchTemplate) => void;
  onClose: () => void;
}

export function WatchTemplates({ onSelectTemplate, onClose }: WatchTemplatesProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Watch Templates</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-6">
            Select a template to pre-fill watch information for common models.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.brand} {template.model}</p>
                    </div>
                    <Watch className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{template.description}</p>
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Typical Price Range</p>
                    <p className="text-sm font-medium text-gray-900">{template.typicalPriceRange}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      onSelectTemplate(template);
                      onClose();
                    }}
                    className="w-full"
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

