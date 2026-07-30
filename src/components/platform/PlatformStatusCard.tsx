import React from 'react';
import { Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveText } from '../ui/executive-typography';

export interface PlatformStatusCardProps {
  readonly title: string;
  readonly status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  readonly message: string;
}

export const PlatformStatusCard: React.FC<PlatformStatusCardProps> = ({ title, status, message }) => {
  return (
    <ExecutiveSurface className="p-3 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-primary" />
          <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
            {title}
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant={status === 'HEALTHY' ? 'success' : status === 'WARNING' ? 'warning' : 'critical'}>
          {status}
        </ExecutiveBadge>
      </div>
      <ExecutiveText variant="caption" className="text-muted-foreground block text-xs">
        {message}
      </ExecutiveText>
    </ExecutiveSurface>
  );
};
