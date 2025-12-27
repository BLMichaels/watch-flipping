'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: 'border-red-200 bg-red-50',
    warning: 'border-yellow-200 bg-yellow-50',
    info: 'border-blue-200 bg-blue-50',
  };

  const buttonStyles = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className={`h-5 w-5 ${
                variant === 'danger' ? 'text-red-600' :
                variant === 'warning' ? 'text-yellow-600' :
                'text-blue-600'
              }`} />
              {title}
            </CardTitle>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-700">{message}</p>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={onCancel}>
                {cancelText}
              </Button>
              <Button
                onClick={onConfirm}
                className={buttonStyles[variant]}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

