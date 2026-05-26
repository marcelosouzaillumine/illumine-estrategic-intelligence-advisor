import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { PageHeader } from '../Common';
import { ProductGovernanceEngine } from '../../core/runtime/product-governance/ProductGovernanceEngine';
import { ProductPlanRegistryPanel } from '../product-governance/ProductPlanRegistryPanel';
import { FeatureEntitlementTable } from '../product-governance/FeatureEntitlementTable';
import { UsageQuotaDashboard } from '../product-governance/UsageQuotaDashboard';
import { SubscriptionStatusCard } from '../product-governance/SubscriptionStatusCard';
import { TrialModePanel } from '../product-governance/TrialModePanel';
import { DemoWorkspacePanel } from '../product-governance/DemoWorkspacePanel';
import { FeatureFlagViewer } from '../product-governance/FeatureFlagViewer';
import { ProductAccessAuditFeed } from '../product-governance/ProductAccessAuditFeed';

export function ProductGovernancePage() {
  const tenantId = 'TENANT-HQ'; // Mock MVP
  const subscription = ProductGovernanceEngine.getSubscription(tenantId);

  if (!subscription) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-destructive text-body-sm font-medium uppercase tracking-widest">
          Subscription não encontrada para o tenant MVP.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      <PageHeader
        title="Governança de Produto & Acesso"
        subtitle="Console administrativo para controle institucional de entitlements, planos e quotas."
        icon={ShieldCheck}
        transparent
      />

      <div className="space-y-6">
        <TrialModePanel isTrial={subscription.status === 'TRIAL'} endDate={subscription.endDate} />
        <DemoWorkspacePanel isDemo={subscription.isDemo} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-10">
          <section className="space-y-4">
            <h3 className="text-h3 font-medium text-foreground tracking-tight">Subscription Overview</h3>
            <SubscriptionStatusCard
              planName={subscription.planId}
              status={subscription.status}
              isDemo={subscription.isDemo}
            />
          </section>

          <section className="space-y-4">
            <h3 className="text-h3 font-medium text-foreground tracking-tight">Limites Operacionais Institucionais</h3>
            <UsageQuotaDashboard tenantId={tenantId} />
          </section>

          <section className="space-y-4">
            <h3 className="text-h3 font-medium text-foreground tracking-tight">Módulos & Entitlements Ativos</h3>
            <FeatureEntitlementTable tenantId={tenantId} />
          </section>
        </div>

        <div className="space-y-6">
          <ProductAccessAuditFeed tenantId={tenantId} />
          <FeatureFlagViewer />
        </div>
      </div>

      <div className="pt-10 border-t border-border">
        <ProductPlanRegistryPanel />
      </div>
    </div>
  );
}
