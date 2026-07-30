import React from 'react';
import { Award, CheckCircle } from 'lucide-react';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveText } from '../ui/executive-typography';

export interface InsightConfidenceCardProps {
  readonly confidenceScore: number;
  readonly rationale?: string;
}

export const InsightConfidenceCard: React.FC<InsightConfidenceCardProps> = ({
  confidenceScore,
  rationale = 'Calculado a partir das demonstrações financeiras consolidadas'
}) => {
  return (
    <ExecutiveSurface className="p-3 mb-3 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Award className="w-3.5 h-3.5 text-primary" />
          <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
            Confiança Preditiva & Fiduciária
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="success">
          {confidenceScore}% Confiável
        </ExecutiveBadge>
      </div>
      <ExecutiveText variant="caption" className="text-muted-foreground mt-1 block text-xs">
        {rationale}
      </ExecutiveText>
    </ExecutiveSurface>
  );
};
