import React from 'react';
import { Activity, ShieldCheck, AlertCircle } from 'lucide-react';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveText } from '../ui/executive-typography';
import { ConnectorStatus } from '@illumine/executive-contracts';

export interface ConnectorStatusCardProps {
  readonly title: string;
  readonly status: ConnectorStatus;
  readonly lastSync: string;
  readonly recordsProcessed: number;
}

export const ConnectorStatusCard: React.FC<ConnectorStatusCardProps> = ({
  title,
  status,
  lastSync,
  recordsProcessed
}) => {
  return (
    <ExecutiveSurface className="p-3 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-primary" />
          <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
            {title}
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant={status === 'HEALTHY' ? 'success' : 'critical'}>
          {status}
        </ExecutiveBadge>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div>
          <span className="block text-[10px] uppercase">Última Sync</span>
          <span className="font-medium text-foreground">{lastSync}</span>
        </div>
        <div>
          <span className="block text-[10px] uppercase">Registros</span>
          <span className="font-medium text-foreground">{recordsProcessed.toLocaleString('pt-BR')}</span>
        </div>
      </div>
    </ExecutiveSurface>
  );
};
