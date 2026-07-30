import React from 'react';
import { Award } from 'lucide-react';
import { ExecutiveBadge } from '../../ui/executive-badge';

export interface ConfidenceIndicatorProps {
  readonly score: number;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({ score }) => {
  return (
    <ExecutiveBadge variant={score >= 90 ? 'success' : 'warning'} className="flex items-center gap-1">
      <Award className="w-3 h-3" />
      <span>{score}% Confiança Preditiva</span>
    </ExecutiveBadge>
  );
};
