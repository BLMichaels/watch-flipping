'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ConditionAssessmentProps {
  conditionNotes?: string | null;
  status: string;
  onUpdateCondition: (assessment: string) => void;
}

export function ConditionAssessment({
  conditionNotes,
  status,
  onUpdateCondition,
}: ConditionAssessmentProps) {
  const assessments = [
    { id: 'excellent', label: 'Excellent', description: 'Like new, minimal wear', color: 'green' },
    { id: 'very_good', label: 'Very Good', description: 'Minor wear, fully functional', color: 'blue' },
    { id: 'good', label: 'Good', description: 'Normal wear, may need service', color: 'yellow' },
    { id: 'fair', label: 'Fair', description: 'Significant wear, needs service', color: 'orange' },
    { id: 'poor', label: 'Poor', description: 'Heavy wear, major issues', color: 'red' },
  ];

  const getStatusIcon = (assessmentId: string) => {
    if (assessmentId === 'excellent' || assessmentId === 'very_good') {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    } else if (assessmentId === 'poor') {
      return <XCircle className="h-5 w-5 text-red-600" />;
    } else {
      return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (assessmentId: string) => {
    const assessment = assessments.find(a => a.id === assessmentId);
    if (!assessment) return 'gray';
    return assessment.color;
  };

  // Try to extract current assessment from condition notes
  const currentAssessment = conditionNotes
    ? assessments.find(a => conditionNotes.toLowerCase().includes(a.id) || conditionNotes.toLowerCase().includes(a.label.toLowerCase()))
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Condition Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {assessments.map((assessment) => {
            const isSelected = currentAssessment?.id === assessment.id;
            return (
              <button
                key={assessment.id}
                onClick={() => onUpdateCondition(assessment.id)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                  isSelected
                    ? `border-${assessment.color}-500 bg-${assessment.color}-50`
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(assessment.id)}
                    <div>
                      <p className="font-medium text-gray-900">{assessment.label}</p>
                      <p className="text-sm text-gray-600">{assessment.description}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
        {conditionNotes && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-1">Current Notes:</p>
            <p className="text-sm text-gray-600">{conditionNotes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

