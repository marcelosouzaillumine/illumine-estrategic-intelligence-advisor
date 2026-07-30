import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { Sparkles, ArrowRight } from 'lucide-react';
import { ExecutiveNudgeContract } from '../../../../packages/domain/executive-contracts/src/living/ExecutiveNudgeContract';

export interface ExecutiveNudgeCardProps {
  readonly nudges: readonly ExecutiveNudgeContract[];
}

export const ExecutiveNudgeCard: React.FC<ExecutiveNudgeCardProps> = ({ nudges }) => {
  if (!nudges || nudges.length === 0) return null;

  return (
    <ExecutiveSurface variant="default" padding="md" radius="lg" className="border border-indigo-500/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h4 className="font-bold text-sm text-foreground">Executive Nudges™ (Recomendações Discretas)</h4>
        </div>
        <ExecutiveBadge variant="info" className="font-mono">Máx. 3 por dia</ExecutiveBadge>
      </div>
      <div className="space-y-2 text-xs">
        {nudges.slice(0, 3).map((ndg) => (
          <div key={ndg.nudgeId} className="p-3 rounded-lg bg-background/50 border border-border/30 flex items-center justify-between gap-3">
            <div>
              <span className="font-semibold text-foreground block text-[11px]">{ndg.reasonText}</span>
              <span className="text-muted-foreground text-[10px]">Benefício: {ndg.expectedBenefitText}</span>
            </div>
            <ExecutiveBadge variant="info" className="cursor-pointer hover:bg-indigo-500/30 text-[10px] whitespace-nowrap shrink-0 flex items-center gap-1">
              {ndg.suggestedActionText} <ArrowRight className="w-3 h-3" />
            </ExecutiveBadge>
          </div>
        ))}
      </div>
    </ExecutiveSurface>
  );
};
