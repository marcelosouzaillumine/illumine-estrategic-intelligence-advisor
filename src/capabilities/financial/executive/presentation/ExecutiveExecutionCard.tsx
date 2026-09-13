import React from 'react';
import { ExecutiveDecisionContext } from '@illumine/executive-contracts';
import { PlayCircle, UserCheck, Clock, Award } from 'lucide-react';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveBadge } from '../../../../components/ui/executive-badge';
import { ExecutiveText } from '../../../../components/ui/executive-typography';

export interface ExecutiveExecutionCardProps {
  readonly context: ExecutiveDecisionContext;
}

export const ExecutiveExecutionCard: React.FC<ExecutiveExecutionCardProps> = ({ context }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <PlayCircle className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Layer 7 — Plano de Execução & Governança (Execution Plan)
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="warning">Prioridade Alta</ExecutiveBadge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        <div className="p-2.5 bg-surface-container/30 rounded border border-border/30">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
            <UserCheck className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase font-semibold">Responsável (Owner)</span>
          </div>
          <span className="font-medium text-foreground">Diretoria Financeira (CFO)</span>
        </div>

        <div className="p-2.5 bg-surface-container/30 rounded border border-border/30">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase font-semibold">Prazo de Conclusão</span>
          </div>
          <span className="font-medium text-foreground">Q3 / {context.period}</span>
        </div>

        <div className="p-2.5 bg-surface-container/30 rounded border border-border/30">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
            <Award className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase font-semibold">Shift Esperado no KPI</span>
          </div>
          <span className="font-medium text-foreground text-success">+2,5 p.p. Margem</span>
        </div>

        <div className="p-2.5 bg-surface-container/30 rounded border border-border/30">
          <span className="text-[10px] uppercase font-semibold text-muted-foreground block mb-1">Critério de Sucesso</span>
          <span className="font-medium text-foreground">FCO {'>'} R$ 1,5M</span>
        </div>
      </div>
    </ExecutiveSurface>
  );
};
