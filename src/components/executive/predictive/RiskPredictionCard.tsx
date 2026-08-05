import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';
import { RiskPredictionContract } from '@illumine/executive-contracts';
import { useExecutiveFormatter } from '../../../core/localization';

export interface RiskPredictionCardProps {
  readonly risk: RiskPredictionContract;
}

export const RiskPredictionCard: React.FC<RiskPredictionCardProps> = ({ risk }) => {
  const formatter = useExecutiveFormatter();
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Risco Previsto: {risk.title}
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant={risk.impactSeverity === 'HIGH' ? 'critical' : 'warning'}>
          {formatter.percentage(risk.probabilityPercent / 100, { maximumFractionDigits: 0 })} Probabilidade
        </ExecutiveBadge>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
        <span>Horizonte: <strong className="text-foreground">{risk.timeHorizonDays} dias</strong></span>
        <span>Impacto Financeiro Previsto: <strong className="text-destructive">{formatter.currency(risk.expectedFinancialImpact)}</strong></span>
      </div>
    </ExecutiveSurface>
  );
};
