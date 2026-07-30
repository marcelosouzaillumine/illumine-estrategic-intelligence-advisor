import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { Clock, Info, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
import { ExecutiveFeedItemContract } from '../../../../packages/domain/executive-contracts/src/living/ExecutiveFeedContract';

export interface ExecutiveFeedCardProps {
  readonly item: ExecutiveFeedItemContract;
}

export const ExecutiveFeedCard: React.FC<ExecutiveFeedCardProps> = ({ item }) => {
  return (
    <div className="p-3 rounded-lg bg-background/50 border border-border/30 space-y-1 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-purple-400 font-bold text-[11px] flex items-center gap-1">
            <Clock className="w-3 h-3 text-purple-400" /> {item.timeFormatted}
          </span>
          <span className="font-bold text-foreground">{item.title}</span>
        </div>
        <ExecutiveBadge variant="info" className="text-[9px] font-mono">{item.category}</ExecutiveBadge>
      </div>
      <p className="text-muted-foreground text-[11px]">{item.summaryText}</p>
      <div className="pt-1 text-[10px] text-muted-foreground italic">
        Explicação: {item.explanationText}
      </div>
    </div>
  );
};
