import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { Sparkles, MessageSquareQuote } from 'lucide-react';
import { ExecutiveNarrativeContract } from '@illumine/executive-contracts';

export interface ExecutiveNarrativeCardProps {
  readonly narrative: ExecutiveNarrativeContract;
}

export const ExecutiveNarrativeCard: React.FC<ExecutiveNarrativeCardProps> = ({ narrative }) => {
  return (
    <ExecutiveSurface variant="default" padding="md" radius="lg" className="border border-border/40 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquareQuote className="w-4 h-4 text-purple-400" />
          <span className="font-semibold text-xs text-muted-foreground">{narrative.technicalMetricName}: {narrative.rawValue}</span>
        </div>
        <ExecutiveBadge variant={narrative.tone === 'WARNING' ? 'warning' : 'info'}>{narrative.tone}</ExecutiveBadge>
      </div>
      <p className="text-xs font-semibold text-foreground leading-relaxed">
        "{narrative.executiveNarrativeText}"
      </p>
    </ExecutiveSurface>
  );
};
