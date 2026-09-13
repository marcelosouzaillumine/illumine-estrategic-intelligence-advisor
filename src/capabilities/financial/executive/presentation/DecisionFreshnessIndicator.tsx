import React from 'react';
import { Clock, RefreshCw } from 'lucide-react';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveBadge } from '../../../../components/ui/executive-badge';
import { ExecutiveText } from '../../../../components/ui/executive-typography';

export interface DecisionFreshnessIndicatorProps {
  readonly lastUpdatedText?: string;
  readonly isRealTime?: boolean;
}

export const DecisionFreshnessIndicator: React.FC<DecisionFreshnessIndicatorProps> = ({
  lastUpdatedText = 'Atualizado agora via Data Fabric',
  isRealTime = true
}) => {
  return (
    <div className="flex items-center justify-between text-xs text-muted-foreground py-1 px-2 bg-surface-container/20 rounded border border-border/20 mb-3">
      <div className="flex items-center gap-1.5">
        <Clock className="w-3 h-3 text-primary" />
        <span>{lastUpdatedText}</span>
      </div>
      {isRealTime && (
        <ExecutiveBadge variant="success" className="text-[9px] uppercase tracking-wider py-0.5 px-1.5 flex items-center gap-1">
          <RefreshCw className="w-2.5 h-2.5 animate-spin" />
          <span>Real-Time Sync</span>
        </ExecutiveBadge>
      )}
    </div>
  );
};
