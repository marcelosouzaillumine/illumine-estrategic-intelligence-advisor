import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { Zap, Gauge, ArrowUpRight } from 'lucide-react';
import { OrganizationalMomentumContract } from '../../../../packages/domain/executive-contracts/src/companion/OrganizationalMomentumContract';

export interface MomentumCardProps {
  readonly momentum?: OrganizationalMomentumContract;
}

export const MomentumCard: React.FC<MomentumCardProps> = ({ momentum }) => {
  if (!momentum) return null;

  return (
    <ExecutiveSurface variant="default" padding="md" radius="lg" className="border border-emerald-500/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-sm text-foreground">Organizational Momentum™</h3>
        </div>
        <ExecutiveBadge variant="success" className="font-mono">
          Score: {momentum.momentumScore} ({momentum.momentumCategory})
        </ExecutiveBadge>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
        <div className="p-2 rounded bg-background/50 border border-border/30">
          <span className="font-bold text-muted-foreground block text-[10px]">VELOCIDADE</span>
          <span className="font-mono font-bold text-emerald-400">{momentum.executionVelocityScore}%</span>
        </div>
        <div className="p-2 rounded bg-background/50 border border-border/30">
          <span className="font-bold text-muted-foreground block text-[10px]">ADOÇÃO</span>
          <span className="font-mono font-bold text-indigo-400">{momentum.adoptionRatePercent}%</span>
        </div>
        <div className="p-2 rounded bg-background/50 border border-border/30">
          <span className="font-bold text-muted-foreground block text-[10px]">RISCO REDUZIDO</span>
          <span className="font-mono font-bold text-purple-400">{momentum.riskReductionPercent}%</span>
        </div>
      </div>
      <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs">
        <span className="font-bold text-emerald-400 text-[10px] uppercase block mb-0.5">PRINCIPAL IMPULSIONADOR:</span>
        <span className="text-foreground">{momentum.primaryDrivers[0]}</span>
      </div>
    </ExecutiveSurface>
  );
};
