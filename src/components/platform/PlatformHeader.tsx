import React from 'react';
import { Settings, Server, ShieldCheck } from 'lucide-react';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveText } from '../ui/executive-typography';

export interface PlatformHeaderProps {
  readonly title: string;
  readonly description?: string;
  readonly resourceName: string;
  readonly environment?: string;
  readonly tenantId?: string;
  readonly status?: 'ACTIVE' | 'DEGRADED' | 'MAINTENANCE';
}

export const PlatformHeader: React.FC<PlatformHeaderProps> = ({
  title,
  description,
  resourceName,
  environment = 'Produção',
  tenantId = 'tenant-default',
  status = 'ACTIVE'
}) => {
  return (
    <ExecutiveSurface className="p-4 mb-6 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-surface-container/60 rounded-lg border border-border/50 text-foreground">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <ExecutiveText variant="sectionTitle" className="font-bold text-foreground">
                {title}
              </ExecutiveText>
              <ExecutiveBadge variant="info" className="text-[10px] uppercase font-bold tracking-wider">
                Platform Workspace
              </ExecutiveBadge>
            </div>
            {description && (
              <ExecutiveText variant="caption" className="text-muted-foreground mt-0.5 block">
                {description}
              </ExecutiveText>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container/40 rounded border border-border/40 text-muted-foreground">
            <Server className="w-3.5 h-3.5" />
            <span>{resourceName} | {environment}</span>
          </div>

          <ExecutiveBadge variant={status === 'ACTIVE' ? 'success' : 'warning'} className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{status === 'ACTIVE' ? 'Operacional' : 'WARNING'}</span>
          </ExecutiveBadge>
        </div>
      </div>
    </ExecutiveSurface>
  );
};
