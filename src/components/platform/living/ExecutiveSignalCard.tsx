import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { AlertOctagon, HelpCircle, ShieldAlert } from 'lucide-react';
import { ExecutiveSignalContract } from '../../../../packages/domain/executive-contracts/src/living/ExecutiveSignalContract';

export interface ExecutiveSignalCardProps {
  readonly signal: ExecutiveSignalContract;
}

export const ExecutiveSignalCard: React.FC<ExecutiveSignalCardProps> = ({ signal }) => {
  return (
    <ExecutiveSurface variant="default" padding="md" radius="lg" className="border border-amber-500/30">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <h4 className="font-bold text-sm text-foreground">{signal.title}</h4>
        </div>
        <ExecutiveBadge variant="warning" className="font-mono">
          Prioridade: {signal.priorityScore}
        </ExecutiveBadge>
      </div>
      <p className="text-xs text-muted-foreground mb-2">{signal.descriptionText}</p>
      <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
        <div>
          <span className="font-bold text-amber-400 text-[10px] uppercase">Consequência da Não Ação:</span>
          <span className="text-foreground text-[11px] block">{signal.nonActionConsequenceText}</span>
        </div>
        <div>
          <span className="font-bold text-amber-400 text-[10px] uppercase">Justificativa Explicável:</span>
          <span className="text-muted-foreground text-[10px] block">{signal.explainabilityJustificationText}</span>
        </div>
      </div>
    </ExecutiveSurface>
  );
};
