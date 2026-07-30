import React from 'react';
import { History, CheckCircle2 } from 'lucide-react';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveText } from '../ui/executive-typography';
import { DecisionMemoryContract } from '@illumine/executive-contracts';

export interface DecisionHistoryCardProps {
  readonly memory: DecisionMemoryContract;
}

export const DecisionHistoryCard: React.FC<DecisionHistoryCardProps> = ({ memory }) => {
  return (
    <ExecutiveSurface className="p-3 mb-3 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          <History className="w-3.5 h-3.5 text-primary" />
          <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
            {memory.decisionTitle}
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant={memory.status === 'COMPLETED' ? 'success' : 'info'}>
          {memory.status}
        </ExecutiveBadge>
      </div>

      <ExecutiveText variant="caption" className="text-muted-foreground block text-xs mt-1">
        Recomendação: {memory.recommendationText}
      </ExecutiveText>
    </ExecutiveSurface>
  );
};
