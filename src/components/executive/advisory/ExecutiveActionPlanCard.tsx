import React from 'react';
import { CheckSquare, User, Calendar } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';
import { ExecutiveActionPlanContract } from '@illumine/executive-contracts';

export interface ExecutiveActionPlanCardProps {
  readonly actionPlan: ExecutiveActionPlanContract;
}

export const ExecutiveActionPlanCard: React.FC<ExecutiveActionPlanCardProps> = ({ actionPlan }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Plano de Execução Acompanhado
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="info">
          {actionPlan.executionStatus}
        </ExecutiveBadge>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        <div className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-primary" />
          <span>Responsável: <strong className="text-foreground">{actionPlan.owner}</strong> ({actionPlan.responsibleArea})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span>Prazo: <strong className="text-foreground">{actionPlan.deadline}</strong></span>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <span className="font-bold text-foreground block">Marcos de Entrega (Milestones):</span>
        {actionPlan.milestones.map((m) => (
          <div key={m.milestoneId} className="flex items-center justify-between p-2 bg-surface-container/30 rounded border border-border/30">
            <span className={m.isCompleted ? 'line-through text-muted-foreground' : 'text-foreground font-medium'}>
              {m.title}
            </span>
            <ExecutiveBadge variant={m.isCompleted ? 'success' : 'neutral'} className="text-[9px]">
              {m.isCompleted ? 'Concluído' : m.dueDate}
            </ExecutiveBadge>
          </div>
        ))}
      </div>
    </ExecutiveSurface>
  );
};
