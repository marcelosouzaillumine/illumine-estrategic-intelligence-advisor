import React from 'react';
import { Award } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';

export interface AdvisorPerformanceCardProps {
  readonly performanceScore: number;
}

export const AdvisorPerformanceCard: React.FC<AdvisorPerformanceCardProps> = ({ performanceScore }) => {
  return (
    <ExecutiveSurface className="p-3 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Award className="w-3.5 h-3.5 text-primary" />
          <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
            Advisor Performance Governance
                                </ExecutiveText>
        </div>
        <ExecutiveBadge variant="success">
          Score de Performance: {performanceScore}
        </ExecutiveBadge>
      </div>
    </ExecutiveSurface>
  );
};
