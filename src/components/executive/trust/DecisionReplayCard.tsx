import React from 'react';
import { RotateCcw } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveText } from '../../ui/executive-typography';

export interface DecisionReplayCardProps {
  readonly replayStatusText: string;
}

export const DecisionReplayCard: React.FC<DecisionReplayCardProps> = ({ replayStatusText }) => {
  return (
    <ExecutiveSurface className="p-3 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <RotateCcw className="w-3.5 h-3.5 text-primary" />
        <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
          Decision Replay (Reprodutibilidade Auditável)
        </ExecutiveText>
      </div>
      <p className="text-muted-foreground text-xs leading-relaxed mt-1">
        {replayStatusText}
      </p>
    </ExecutiveSurface>
  );
};
