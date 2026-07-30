import React from 'react';
import { Activity, TrendingUp, RefreshCw } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';

export interface ExecutiveOutcomeTrackingCardProps {
  readonly expectedImpactText: string;
  readonly actualOutcomeText?: string;
  readonly variancePercent?: number;
}

export const ExecutiveOutcomeTrackingCard: React.FC<ExecutiveOutcomeTrackingCardProps> = ({
  expectedImpactText,
  actualOutcomeText = 'Acompanhamento em andamento via Data Fabric',
  variancePercent = 100
}) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Acompanhamento de Resultado: Previsto vs Realizado
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="success">
          Acurácia: {variancePercent}%
        </ExecutiveBadge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-surface-container/30 rounded border border-border/30">
          <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Resultado Previsto</span>
          <span className="font-bold text-foreground text-sm">{expectedImpactText}</span>
        </div>

        <div className="p-3 bg-surface-container/30 rounded border border-border/30">
          <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Resultado Realizado</span>
          <span className="font-bold text-success text-sm">{actualOutcomeText}</span>
        </div>
      </div>
    </ExecutiveSurface>
  );
};
