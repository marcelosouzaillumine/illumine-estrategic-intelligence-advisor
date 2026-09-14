import React from 'react';
import { ExecutiveDecisionContext } from '@illumine/executive-contracts';
import { GitFork, Layers, TrendingUp } from 'lucide-react';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveBadge } from '../../../../components/ui/executive-badge';
import { ExecutiveText } from '../../../../components/ui/executive-typography';

export interface ExecutiveDeliberationCardProps {
  readonly context: ExecutiveDecisionContext;
}

export const ExecutiveDeliberationCard: React.FC<ExecutiveDeliberationCardProps> = ({ context }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <GitFork className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Layer 5 — Deliberação & Cenários Alternativos
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="info">Simulação Pilot</ExecutiveBadge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-surface-container/30 rounded border border-border/40">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold text-foreground">Cenário Base (Inércia)</span>
          </div>
          <p className="text-muted-foreground">
            Manutenção da trajetória atual sem intervenção nos contratos operacionais da {context.companyName}.
          </p>
        </div>

        <div className="p-3 bg-surface-container/30 rounded border border-border/40">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="font-semibold text-foreground">Cenário Otimizado (Recomendado)</span>
          </div>
          <p className="text-muted-foreground">
            Reestruturação de 5% em despesas não essenciais com recuperação projetada de +2,5 p.p. de margem líquida.
          </p>
        </div>
      </div>
    </ExecutiveSurface>
  );
};
