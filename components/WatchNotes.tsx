'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Plus, Edit2, Trash2, Bell } from 'lucide-react';
import { useState } from 'react';

interface Note {
  id: string;
  content: string;
  createdAt: string;
  reminderDate?: string;
}

interface WatchNotesProps {
  watchId: string;
  notes?: string | null;
  onUpdateNotes: (watchId: string, notes: string) => Promise<void>;
}

export function WatchNotes({ watchId, notes, onUpdateNotes }: WatchNotesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState(notes || '');

  const handleSave = async () => {
    await onUpdateNotes(watchId, editedNotes);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedNotes(notes || '');
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit2 className="h-4 w-4" />
          Notes & Observations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px]"
              placeholder="Add notes about this watch..."
            />
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleSave}>
                Save
              </Button>
              <Button variant="secondary" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {notes ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{notes}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="mt-2"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit Notes
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500 mb-3">No notes yet</p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Notes
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

