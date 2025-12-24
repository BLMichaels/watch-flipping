'use client';

import { Button } from './ui/Button';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface QuickStatusUpdateProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
}

export function QuickStatusUpdate({ currentStatus, onStatusChange }: QuickStatusUpdateProps) {
  const statuses = [
    { value: 'ready_to_sell', label: 'Ready to Sell', icon: CheckCircle, color: 'green' },
    { value: 'needs_service', label: 'Needs Service', icon: AlertCircle, color: 'yellow' },
    { value: 'problem_item', label: 'Problem Item', icon: XCircle, color: 'red' },
    { value: 'sold', label: 'Sold', icon: CheckCircle, color: 'blue' },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {statuses.map((status) => {
        const Icon = status.icon;
        const isActive = currentStatus === status.value;
        return (
          <Button
            key={status.value}
            variant={isActive ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onStatusChange(status.value)}
            className={isActive 
              ? '' 
              : 'bg-white border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900'}
          >
            <Icon className="h-4 w-4 mr-1" />
            {status.label}
          </Button>
        );
      })}
    </div>
  );
}

