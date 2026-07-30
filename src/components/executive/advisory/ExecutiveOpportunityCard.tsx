import React from 'react';
import { Target, Zap } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';
import { ExecutiveAdvisoryOpportunity } from '@illumine/executive-contracts';

export interface ExecutiveOpportunityCardProps {
  readonly opportunity: ExecutiveAdvisoryOpportunity;
  readonly priorityScore: number;
}

export const ExecutiveOpportunityCard: React.FC<ExecutiveOpportunityCardProps> = ({ opportunity, priorityScore }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Oportunidade Decisória Detectada ({opportunity.opportunityId})
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="critical" className="flex items-center gap-1">
          <Zap className="w-3 h-3" />
          <span>Priority Score: {priorityScore}</span>
        </ExecutiveBadge>
      </div>

      <ExecutiveText variant="bodyStandard" className="font-bold text-foreground mb-1">
        Sinal Detectado: {opportunity.detectedSignal}
      </ExecutiveText>

      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
        <span>Impacto Financeiro Estimado: <strong className="text-success">R$ {opportunity.businessImpact.toLocaleString('pt-BR')}</strong></span>
        <span>Data Limite Recomendada: <strong className="text-foreground">{opportunity.recommendedDecisionDate}</strong></span>
      </div>
    </ExecutiveSurface>
  );
};
