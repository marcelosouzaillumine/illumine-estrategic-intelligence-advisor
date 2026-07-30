import React from 'react';
import { GitCompare } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';
import { CounterfactualContract } from '@illumine/executive-contracts';

export interface CounterfactualAnalysisCardProps {
  readonly analysis: CounterfactualContract;
}

export const CounterfactualAnalysisCard: React.FC<CounterfactualAnalysisCardProps> = ({ analysis }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Análise Contrafactual de Sensibilidade ({analysis.sensitiveVariable})
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant={analysis.wouldDecisionChange ? 'warning' : 'success'}>
          {analysis.wouldDecisionChange ? 'Sensível a Variação' : 'Estável'}
        </ExecutiveBadge>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
        <span>Valor Base: <strong className="text-foreground">{analysis.baseValue}%</strong></span>
        <span>Variação Testada: <strong className="text-foreground">{analysis.counterfactualValue}% ({analysis.deltaDeltaPoints > 0 ? `+${analysis.deltaDeltaPoints}` : analysis.deltaDeltaPoints} p.p.)</strong></span>
      </div>

      <p className="text-muted-foreground text-xs leading-relaxed mt-2 pt-2 border-t border-border/30">
        <strong className="text-foreground">Impacto na Decisão: </strong>{analysis.alteredCouncilRecommendation}
      </p>
    </ExecutiveSurface>
  );
};
