import React from 'react';
import { Database, Server } from 'lucide-react';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveText } from '../ui/executive-typography';
import { ConnectorSpecification } from '@illumine/executive-contracts';

export interface DataSourceCardProps {
  readonly connector: ConnectorSpecification;
}

export const DataSourceCard: React.FC<DataSourceCardProps> = ({ connector }) => {
  return (
    <ExecutiveSurface className="p-3 mb-3 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-primary" />
          <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
            {connector.name}
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant={connector.status === 'HEALTHY' ? 'success' : 'warning'}>
          {connector.sourceType}
        </ExecutiveBadge>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
        <span>Frequência: {connector.frequency}</span>
        <span>Última Sync: {connector.lastSyncTimestamp}</span>
      </div>
    </ExecutiveSurface>
  );
};
