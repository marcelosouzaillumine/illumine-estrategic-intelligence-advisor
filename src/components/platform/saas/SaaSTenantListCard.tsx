import React from 'react';
import { Database } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveText } from '../../ui/executive-typography';

export interface SaaSTenantListCardProps {
  readonly activeTenantsCount: number;
}

export const SaaSTenantListCard: React.FC<SaaSTenantListCardProps> = ({ activeTenantsCount }) => {
  return (
    <ExecutiveSurface className="p-3 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-primary" />
          <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
            Tenants Ativos no Ecossistema
          </ExecutiveText>
        </div>
        <span className="font-bold text-primary text-sm">{activeTenantsCount} Tenants</span>
      </div>
    </ExecutiveSurface>
  );
};
