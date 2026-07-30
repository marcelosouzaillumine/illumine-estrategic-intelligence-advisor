import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { Trophy, Target, Lightbulb } from 'lucide-react';
import { ExecutiveMomentContract } from '../../../../packages/domain/executive-contracts/src/living/ExecutiveMomentContract';

export interface ExecutiveMomentCardProps {
  readonly moment: ExecutiveMomentContract;
}

export const ExecutiveMomentCard: React.FC<ExecutiveMomentCardProps> = ({ moment }) => {
  return (
    <ExecutiveSurface variant="default" padding="md" radius="lg" className="border border-amber-500/30">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h4 className="font-bold text-sm text-foreground">{moment.title}</h4>
        </div>
        {moment.isSimulatedBenchmark && (
          <ExecutiveBadge variant="warning" className="font-mono text-[9px]">
            BENCHMARK SIMULADO DE HOMOLOGAÇÃO
          </ExecutiveBadge>
        )}
      </div>
      <p className="text-xs text-muted-foreground mb-2">{moment.milestoneDescription}</p>
      <div className="space-y-1 text-xs">
        <div className="flex items-center gap-1.5 text-amber-300 text-[11px]">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Aprendizado: {moment.keyLearningText}</span>
        </div>
        <div className="flex items-center gap-1.5 text-indigo-300 text-[11px]">
          <Target className="w-3.5 h-3.5 text-indigo-400" />
          <span>Próximo Objetivo: {moment.recommendedNextObjectiveText}</span>
        </div>
      </div>
    </ExecutiveSurface>
  );
};
