import React from 'react';
import { Server } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';
import { SaaSOrganizationContract, SaaSTenantContract } from '@illumine/executive-contracts';

export interface SaaSProvisioningCardProps {
  readonly organization: SaaSOrganizationContract;
  readonly tenant: SaaSTenantContract;
}

export const SaaSProvisioningCard: React.FC<SaaSProvisioningCardProps> = ({ organization, tenant }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Provisionamento de Tenant ({organization.name})
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="success">
          Status: {tenant.status}
        </ExecutiveBadge>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
        <span>Domínio Tenant: <strong className="text-foreground">{tenant.tenantDomain}</strong></span>
        <span>Banco Isolado: <strong className="text-success">{tenant.isIsolatedDatabase ? 'Sim (Dedicated)' : 'Shared'}</strong></span>
      </div>
    </ExecutiveSurface>
  );
};
