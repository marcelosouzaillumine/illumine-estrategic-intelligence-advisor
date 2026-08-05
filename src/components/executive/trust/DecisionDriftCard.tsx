import React from 'react';
import { Activity } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';

export interface DecisionDriftCardProps {
  readonly driftStatusText: string;
  readonly isHealthy: boolean;
}

export const DecisionDriftCard: React.FC<DecisionDriftCardProps> = ({ driftStatusText, isHealthy }) => {
  return (
    <ExecutiveSurface className="p-3 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-primary" />
          <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
            Decision Drift Monitor — Saúde Preditiva do Modelo
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant={isHealthy ? 'success' : 'critical'}>
          {isHealthy ? 'HEALTHY' : 'Alerta de Deriva'}
        </ExecutiveBadge>
      </div>
      <p className="text-muted-foreground text-xs leading-relaxed mt-1">
        {driftStatusText}
      </p>
    </ExecutiveSurface>
  );
};
