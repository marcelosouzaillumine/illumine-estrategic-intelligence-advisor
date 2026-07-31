import React from 'react';
import { InstitutionalLesson } from '@illumine/institutional-learning-intelligence';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ExecutiveBadge as Badge } from '../ui/executive-badge';
import { CheckCircle2, XCircle, ShieldAlert } from 'lucide-react';

interface ExecutiveLearningCardProps {
  lesson: InstitutionalLesson;
}

export function ExecutiveLearningCard({ lesson }: ExecutiveLearningCardProps) {
  return (
    <Card className="border-l-4 border-l-blue-600 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-blue-600" />
            Institutional Learning
          </CardTitle>
          <Badge variant={lesson.confidence.level === 'validated' ? 'success' : 'neutral'}>
            {lesson.confidence.level.toUpperCase()}
          </Badge>
        </div>
        <CardDescription className="text-xs text-slate-500 mt-1">
          Based on {lesson.confidence.evidenceCount} historical decisions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-medium text-slate-800 italic mb-4">
          "{lesson.learning.principleGenerated}"
        </p>
        
        <div className="grid grid-cols-2 gap-4 text-sm mt-3">
          <div className="bg-green-50 rounded-md p-3">
            <div className="flex items-center gap-1 text-green-700 font-semibold mb-2">
              <CheckCircle2 className="w-4 h-4" /> What Worked
            </div>
            <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
              {lesson.learning.whatWorked.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 rounded-md p-3">
            <div className="flex items-center gap-1 text-red-700 font-semibold mb-2">
              <XCircle className="w-4 h-4" /> What Failed
            </div>
            <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
              {lesson.learning.whatFailed.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
