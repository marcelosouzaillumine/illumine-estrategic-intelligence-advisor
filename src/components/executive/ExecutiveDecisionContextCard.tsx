import React from 'react';
import { ExecutiveDecisionContext } from '@illumine/executive-contracts';
import { Target, Building2, Calendar, ShieldCheck } from 'lucide-react';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveText } from '../ui/executive-typography';

export interface ExecutiveDecisionContextCardProps {
  readonly context: ExecutiveDecisionContext;
}

export const ExecutiveDecisionContextCard: React.FC<ExecutiveDecisionContextCardProps> = ({ context }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-3 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Layer 1 — Contexto Executivo de Decisão
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="neutral" className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-success" />
          <span>Confiança: {context.confidenceLevel}%</span>
        </ExecutiveBadge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="flex items-center gap-2 p-2 bg-surface-container/40 rounded border border-border/30">
          <Building2 className="w-4 h-4 text-muted-foreground" />
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase tracking-wider font-semibold">Empresa</span>
            <span className="font-medium text-foreground">{context.companyName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 bg-surface-container/40 rounded border border-border/30">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase tracking-wider font-semibold">Exercício / Comparação</span>
            <span className="font-medium text-foreground">{context.period} vs {context.comparisonPeriod} ({context.comparisonType})</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 bg-surface-container/40 rounded border border-border/30">
          <ShieldCheck className="w-4 h-4 text-muted-foreground" />
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase tracking-wider font-semibold">Unidade Organizacional</span>
            <span className="font-medium text-foreground">{context.organizationalUnit || 'Consolidado'}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-muted-foreground bg-surface-container/20 p-2.5 rounded border border-border/20">
        <span className="font-semibold text-foreground mr-1">Pergunta Executiva:</span>
        "Esta análise avalia o desempenho financeiro e fiduciário da {context.companyName} no período {context.period} considerando margens, geração de caixa e sustentabilidade do capital."
      </div>
    </ExecutiveSurface>
  );
};
