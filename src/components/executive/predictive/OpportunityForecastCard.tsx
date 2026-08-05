import React from 'react';
import { Target, TrendingUp } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';
import { OpportunityPredictionContract } from '@illumine/executive-contracts';
import { useExecutiveFormatter } from '../../../core/localization';

export interface OpportunityForecastCardProps {
  readonly opportunity: OpportunityPredictionContract;
}

export const OpportunityForecastCard: React.FC<OpportunityForecastCardProps> = ({ opportunity }) => {
  const formatter = useExecutiveFormatter();
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Oportunidade Prevista: {opportunity.title}
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="success">
          {formatter.percentage(opportunity.probabilityPercent / 100, { maximumFractionDigits: 0 })} Probabilidade
        </ExecutiveBadge>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
        <span>Ganho Esperado: <strong className="text-success">{formatter.currency(opportunity.expectedGainValue)}</strong></span>
        <span>Investimento: <strong className="text-foreground">{formatter.currency(opportunity.investmentRequiredValue)}</strong></span>
      </div>
    </ExecutiveSurface>
  );
};
