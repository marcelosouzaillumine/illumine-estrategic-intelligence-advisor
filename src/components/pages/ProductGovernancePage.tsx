import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ProductGovernanceEngine } from '../../services/FiduciaryRuntimeAdapter';
import { ProductPlanRegistryPanel } from '../product-governance/ProductPlanRegistryPanel';
import { FeatureEntitlementTable } from '../product-governance/FeatureEntitlementTable';
import { UsageQuotaDashboard } from '../product-governance/UsageQuotaDashboard';
import { SubscriptionStatusCard } from '../product-governance/SubscriptionStatusCard';
import { TrialModePanel } from '../product-governance/TrialModePanel';
import { DemoWorkspacePanel } from '../product-governance/DemoWorkspacePanel';
import { FeatureFlagViewer } from '../product-governance/FeatureFlagViewer';
import { ProductAccessAuditFeed } from '../product-governance/ProductAccessAuditFeed';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveAccordion } from '../ui/executive-accordion';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveMetricCard } from '../ui/executive-metric-card';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { StatusBadge } from '../Common';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { useProductGovernancePageViewModel } from '../../viewmodels/useProductGovernancePageViewModel';



export function ProductGovernancePage() {
  // Adapter: useProductGovernancePageAdapter
  // ViewModel: useProductGovernancePageViewModel
  const { state: vmState, computed: vmComputed, actions: vmActions } = useProductGovernancePageViewModel({ clientId: '' });
  const tenantId = 'TENANT-HQ'; // Mock MVP
  const subscription = ProductGovernanceEngine.getSubscription(tenantId);

  if (!subscription) {
    return (
      <ExecutivePageTemplate header={{
        title: "Governança de Produto",
        description: "Console administrativo para controle institucional de entitlements, planos e quotas.",
      }}>
        <ExecutiveEmptyState
          title="Subscription não encontrada"
          description="Subscription não encontrada para o tenant MVP."
          compact
        />
      </ExecutivePageTemplate>
    );
  }

  return (
    <ExecutivePageTemplate header={{
      title: "Governança de Produto",
      description: "Console administrativo para controle institucional de entitlements, planos e quotas.",
    }}>

      <div className="space-y-6">
        <TrialModePanel isTrial={subscription.status === 'TRIAL'} endDate={subscription.endDate} />
        <DemoWorkspacePanel isDemo={subscription.isDemo} />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

        <div className="flex items-center gap-3">
          <StatusBadge status={subscription.status === 'ACTIVE' ? 'Ativo' : 'Pendente'} label={subscription.status} />
          <ExecutiveText as="span" variant="bodyStandard" className="text-muted-foreground">Tenant: {tenantId}</ExecutiveText>
        </div>
      
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <ExecutiveMetricCard density="analytical" label="Plano Ativo" value={subscription.planId} trend="up" />
        <ExecutiveMetricCard density="analytical" label="Status" value={subscription.status} trend="neutral" />
        <ExecutiveMetricCard density="analytical" label="Modo Demo" value={subscription.isDemo ? 'Sim' : 'Não'} trend="neutral" />
      </div>

      <div className="mt-12 mb-8 border-t border-border pt-8" />
      <ExecutiveAccordion
        title="Console de Entitlements e Limites"
        subtitle="Visão consolidada de planos, quotas e módulos ativos."
        variant="analytics"
        defaultExpanded
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-10">
            <section className="space-y-4">
              <ExecutiveHeading as="h3" className="text-h3 text-foreground">Subscription Overview</ExecutiveHeading>
              <SubscriptionStatusCard
                planName={subscription.planId}
                status={subscription.status}
                isDemo={subscription.isDemo}
              />
            </section>

            <section className="space-y-4">
              <ExecutiveHeading as="h3" className="text-h3 text-foreground">Limites Operacionais Institucionais</ExecutiveHeading>
              <UsageQuotaDashboard tenantId={tenantId} />
            </section>

            <section className="space-y-4">
              <ExecutiveHeading as="h3" className="text-h3 text-foreground">Módulos &amp; Entitlements Ativos</ExecutiveHeading>
              <FeatureEntitlementTable tenantId={tenantId} />
            </section>
          </div>

          <div className="space-y-6">
            <ProductAccessAuditFeed tenantId={tenantId} />
            <FeatureFlagViewer />
          </div>
        </div>
      </ExecutiveAccordion>

      <div className="mt-12 pt-10 border-t border-border mb-8">
        <ProductPlanRegistryPanel />
      </div>
    </ExecutivePageTemplate>
  );
}
