import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { UserCheck, Shield, Sparkles, TrendingUp } from 'lucide-react';
import { ExecutiveCompanionContract } from '../../../../packages/domain/executive-contracts/src/companion/ExecutiveCompanionContract';

export interface ExecutiveCompanionCardProps {
  readonly companion: ExecutiveCompanionContract;
}

export const ExecutiveCompanionCard: React.FC<ExecutiveCompanionCardProps> = ({ companion }) => {
  return (
    <ExecutiveSurface variant="default" padding="md" radius="lg" className="border border-indigo-500/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-sm text-foreground">Executive Companion™ Profile</h3>
        </div>
        <ExecutiveBadge variant="info" className="font-mono">
          Growth Score: {companion.leadershipGrowthScore}
        </ExecutiveBadge>
      </div>
      <div className="space-y-2 text-xs">
        <div className="p-2.5 rounded bg-background/50 border border-border/30">
          <span className="font-bold text-muted-foreground block text-[10px]">ESTÁGIO DE EVOLUÇÃO</span>
          <span className="font-semibold text-foreground">{companion.leadershipEvolutionStage}</span>
        </div>
        <div className="p-2.5 rounded bg-background/50 border border-border/30">
          <span className="font-bold text-muted-foreground block text-[10px]">PADRÃO DECISÓRIO</span>
          <span className="text-foreground">{companion.decisionPatternSummary}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
            <span className="font-bold text-emerald-400 block text-[10px]">PONTOS FORTES</span>
            <span className="text-foreground text-[11px]">{companion.currentStrengths[0]}</span>
          </div>
          <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20">
            <span className="font-bold text-amber-400 block text-[10px]">DESAFIOS ATUAIS</span>
            <span className="text-foreground text-[11px]">{companion.currentChallenges[0]}</span>
          </div>
        </div>
      </div>
    </ExecutiveSurface>
  );
};
