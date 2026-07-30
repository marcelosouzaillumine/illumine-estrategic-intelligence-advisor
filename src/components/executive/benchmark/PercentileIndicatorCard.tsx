import React from 'react';
import { Target } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';

export interface PercentileIndicatorCardProps {
  readonly metricName: string;
  readonly percentile: number;
  readonly statusText: string;
}

export const PercentileIndicatorCard: React.FC<PercentileIndicatorCardProps> = ({
  metricName,
  percentile,
  statusText
}) => {
  return (
    <ExecutiveSurface className="p-3 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-primary" />
          <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
            {metricName}
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant={percentile >= 50 ? 'success' : 'warning'}>
          P{percentile}
        </ExecutiveBadge>
      </div>
      <p className="text-muted-foreground text-xs mt-1">
        {statusText}
      </p>
    </ExecutiveSurface>
  );
};
