import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
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
    return <div className="p-8 text-rose-500">Subscription not found for mock MVP tenant.</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in bg-background min-h-screen">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <ShieldCheck className="text-primary" />
            Governança de Produto & Acesso
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Console administrativo para controle institucional de entitlements, planos e quotas.
          </p>
        </div>
      </div>

      <TrialModePanel isTrial={subscription.status === 'TRIAL'} endDate={subscription.endDate} />
      <DemoWorkspacePanel isDemo={subscription.isDemo} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Subscription Overview</h2>
            <SubscriptionStatusCard 
              planName={subscription.planId} 
              status={subscription.status} 
              isDemo={subscription.isDemo}
            />
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              Limites Operacionais Institucionais <ArrowRight size={16} className="text-muted-foreground" />
            </h2>
            <UsageQuotaDashboard tenantId={tenantId} />
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Módulos & Entitlements Ativos</h2>
            <FeatureEntitlementTable tenantId={tenantId} />
          </section>
        </div>

        <div className="space-y-6">
          <ProductAccessAuditFeed tenantId={tenantId} />
          <FeatureFlagViewer />
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-border">
        <ProductPlanRegistryPanel />
      </div>

    </div>
  );
}
