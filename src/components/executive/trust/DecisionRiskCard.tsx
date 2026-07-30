import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';

export interface DecisionRiskCardProps {
  readonly compositeRiskScore: number;
}

export const DecisionRiskCard: React.FC<DecisionRiskCardProps> = ({ compositeRiskScore }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Score de Risco Multidimensional da Decisão
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant={compositeRiskScore <= 20 ? 'success' : 'warning'}>
          Risco Composto: {compositeRiskScore}%
        </ExecutiveBadge>
      </div>
      <ExecutiveText variant="bodyStandard" className="text-muted-foreground text-xs">
        Risco calculado agregando exposição financeira, operacional, estratégica, de execução e qualidade de dados.
      </ExecutiveText>
    </ExecutiveSurface>
  );
};
