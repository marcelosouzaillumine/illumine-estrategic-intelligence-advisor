// @ts-nocheck
import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { Compass, BookOpen, Check } from 'lucide-react';
import { ExecutiveWisdomContract } from '../../../../packages/domain/executive-contracts/src/companion/ExecutiveWisdomContract';

export interface ExecutiveWisdomCardProps {
  readonly wisdom?: readonly ExecutiveWisdomContract[];
}

export const ExecutiveWisdomCard: React.FC<ExecutiveWisdomCardProps> = ({ wisdom }) => {
  if (!wisdom || wisdom.length === 0) return null;

  return (
    <ExecutiveSurface variant="default" padding="md" radius="lg" className="border border-cyan-500/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-sm text-foreground">Executive Wisdom Card™</h3>
        </div>
        <ExecutiveBadge variant="info" className="font-mono">
          Sabedoria Decisória Acumulada
        </ExecutiveBadge>
      </div>
      <div className="space-y-2.5 text-xs">
        {wisdom.map((wsd) => (
          <div key={wsd.wisdomId} className="p-3 rounded-lg bg-background/50 border border-border/30">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-cyan-300 text-xs">{wsd.corePatternTitle}</span>
              <ExecutiveBadge variant="success" className="text-[9px] font-mono">
                Sucesso: {wsd.historicalSuccessRatePercent}%
              </ExecutiveBadge>
            </div>
            <p className="text-muted-foreground text-[11px] mb-1.5">{wsd.empiricalEvidenceText}</p>
            <div className="flex items-center gap-1.5 text-foreground font-semibold text-[11px]">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Ação Recomendada: {wsd.recommendedActionText}</span>
            </div>
          </div>
        ))}
      </div>
    </ExecutiveSurface>
  );
};
