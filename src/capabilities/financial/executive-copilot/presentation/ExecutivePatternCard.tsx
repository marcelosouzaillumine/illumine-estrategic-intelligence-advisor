import React from 'react';
import { LearningPattern } from '@illumine/institutional-learning-intelligence';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/card';
import { ExecutiveBadge as Badge } from '../../../../components/ui/executive-badge';
import { Network } from 'lucide-react';

interface ExecutivePatternCardProps {
  pattern: LearningPattern;
}

export function ExecutivePatternCard({ pattern }: ExecutivePatternCardProps) {
  return (
    <Card className="border-l-4 border-l-purple-600 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Network className="w-4 h-4 text-purple-600" />
            Institutional Pattern
          </CardTitle>
          <Badge variant="neutral" className="bg-purple-50 text-purple-700 border-purple-200">
            {pattern.maturity.replace('_', ' ')}
          </Badge>
        </div>
        <CardDescription className="text-xs text-slate-500 mt-1">
          {pattern.causalEvidenceAssessment.correlationStrength.replace('_', ' ')} Causality
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-700 font-medium mb-3">
          {pattern.description}
        </p>
        <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
          <p className="text-xs text-slate-500 mb-1 font-semibold">Evidence Base</p>
          <p className="text-xs text-slate-600">{pattern.causalEvidenceAssessment.evidenceBase}</p>
        </div>
      </CardContent>
    </Card>
  );
}
