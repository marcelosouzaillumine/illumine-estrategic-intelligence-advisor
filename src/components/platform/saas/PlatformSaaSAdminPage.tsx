import React from 'react';
import { Server, ShieldCheck, Activity, Database, KeyRound, Cpu } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveText } from '../../ui/executive-typography';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { SaaSProvisioningCard } from './SaaSProvisioningCard';
import { SaaSSubscriptionCard } from './SaaSSubscriptionCard';
import { SaaSQuotaUsageCard } from './SaaSQuotaUsageCard';
import { SaaSAuditTrailCard } from './SaaSAuditTrailCard';
import { SaaSTenantListCard } from './SaaSTenantListCard';

export const PlatformSaaSAdminPage: React.FC = () => {
  const mockOrg = {
    organizationId: 'org-enterprise-01',
    name: 'Illumine Enterprise SaaS Network',
    createdAt: new Date().toISOString(),
    ownerUserId: 'user-admin-01',
    defaultTenantId: 'tenant-enterprise-01',
    subscriptionPlan: 'ENTERPRISE_PARTNER' as const
  };

  const mockTenant = {
    tenantId: 'tenant-enterprise-01',
    organizationId: 'org-enterprise-01',
    tenantDomain: 'app.illumine.ai',
    isIsolatedDatabase: true,
    status: 'ACTIVE' as const,
    createdAt: new Date().toISOString()
  };

  const mockSubscription = {
    subscriptionId: 'sub-enterprise-01',
    organizationId: 'org-enterprise-01',
    planId: 'ENTERPRISE_PARTNER',
    status: 'ACTIVE' as const,
    currentPeriodStart: new Date().toISOString(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    enabledFeatures: ['MULTI_TENANT', 'ISOLATED_DB', 'AUTO_PROVISIONING', 'AI_COUNCIL_ENTERPRISE']
  };

  const mockQuota = {
    organizationId: 'org-enterprise-01',
    maxCompanies: 500,
    currentCompanies: 42,
    maxUsers: 1000,
    currentUserCount: 128,
    maxAdvisors: 100,
    currentAdvisorCount: 18,
    maxStorageGB: 2000,
    currentStorageGB: 145,
    maxMonthlyAICalls: 500000,
    currentMonthlyAICalls: 38400
  };

  const mockAudit = {
    auditLogId: 'audit-101',
    correlationId: 'corr-8842',
    executionId: 'exec-9921',
    timestamp: new Date().toISOString(),
    actorUserId: 'user-admin-01',
    organizationId: 'org-enterprise-01',
    tenantId: 'tenant-enterprise-01',
    actionType: 'PROVISION_ORGANIZATION_AUTOMATED',
    resultStatus: 'SUCCESS' as const
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* 1. PLATFORM EXPERIENCE PROTOCOL: HEADER */}
      <ExecutiveSurface className="p-6 bg-card border border-border rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Server className="w-5 h-5 text-primary" />
              <ExecutiveHeading as="h2" className="text-xl font-bold text-primary">
                Platform SaaS Administration & Provisioning Center
              </ExecutiveHeading>
            </div>
            <ExecutiveText variant="bodyStandard" className="text-muted-foreground text-xs">
              Gestão operacional multi-tenant, controle de quotas, assinaturas e audit trail enterprise.
            </ExecutiveText>
          </div>
          <ExecutiveBadge variant="success">
            SaaS Runtime: 99.99% Availability
          </ExecutiveBadge>
        </div>
      </ExecutiveSurface>

      {/* 2. PLATFORM EXPERIENCE PROTOCOL: GOVERNANCE */}
      <ExecutiveSurface className="p-4 bg-card border border-border rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
          <ShieldCheck className="w-4 h-4 text-success" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Governança de Acesso RBAC & Segregação de Funções
          </ExecutiveText>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2 p-2 bg-surface-container/30 rounded border border-border/30">
            <KeyRound className="w-3.5 h-3.5 text-primary" />
            <span>RBAC Baseado em Contratos Públicos</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-surface-container/30 rounded border border-border/30">
            <Database className="w-3.5 h-3.5 text-primary" />
            <span>Isolamento por Tenant Criptográfico</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-surface-container/30 rounded border border-border/30">
            <Cpu className="w-3.5 h-3.5 text-primary" />
            <span>Audit Trail com Correlation ID</span>
          </div>
        </div>
      </ExecutiveSurface>

      {/* 3. PLATFORM EXPERIENCE PROTOCOL: METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SaaSTenantListCard activeTenantsCount={mockQuota.currentCompanies} />
        <SaaSQuotaUsageCard quota={mockQuota} />
      </div>

      {/* 4. PLATFORM EXPERIENCE PROTOCOL: WORKSPACE */}
      <div className="space-y-4">
        <SaaSProvisioningCard organization={mockOrg} tenant={mockTenant} />
        <SaaSSubscriptionCard subscription={mockSubscription} />
      </div>

      {/* 5. PLATFORM EXPERIENCE PROTOCOL: EDITOR & PROVISIONING TEMPLATES */}
      <ExecutiveSurface className="p-4 bg-card border border-border rounded-lg shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-border/50">
          <Activity className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Provisionador Automático de Organização & Templates
          </ExecutiveText>
          <ExecutiveBadge variant="neutral">
            Modo Automático
          </ExecutiveBadge>
        </div>
        <p className="text-muted-foreground text-xs leading-relaxed">
          Fluxo de provisionamento executado automaticamente: Organization → Tenant → Workspace → Permissions → Quotas → Templates.
        </p>
      </ExecutiveSurface>

      {/* 6. PLATFORM EXPERIENCE PROTOCOL: AUDIT TRAIL */}
      <SaaSAuditTrailCard auditLog={mockAudit} />
    </div>
  );
};
