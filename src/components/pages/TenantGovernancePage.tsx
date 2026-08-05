import React from 'react';
import { ShieldCheck, Activity, Users, Database } from 'lucide-react';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveAccordion } from '../ui/executive-accordion';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveMetricCard } from '../ui/executive-metric-card';
import { StatusBadge } from '../Common';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { useTenantGovernancePageViewModel } from '../../viewmodels/useTenantGovernancePageViewModel';




export function TenantGovernancePage() {
  // Adapter: useTenantGovernancePageAdapter
  // ViewModel: useTenantGovernancePageViewModel
  const { state: vmState, computed: vmComputed, actions: vmActions } = useTenantGovernancePageViewModel({ clientId: '' });
  const portal = createPortal;
  const kpis = [
    { label: 'Tenants Ativos', value: '1', icon: Database, trend: 'up' as const },
    { label: 'Workspaces Operacionais', value: '2', icon: Users, trend: 'up' as const },
    { label: 'Execuções Rastreadas', value: '1.042', icon: Activity, trend: 'up' as const },
    { label: 'Leakage Detectado', value: '0', icon: ShieldCheck, trend: 'neutral' as const },
  ];

  const auditLog = [
    { time: '12:45:00', tag: 'SWITCH_WORKSPACE', tagColor: 'bg-secondary/10 text-secondary', message: 'Advisory Team alterou workspace para ', strong: 'WS-DEMO-02', suffix: '. Cache local invalidado.' },
    { time: '12:30:15', tag: 'LOGIN', tagColor: 'bg-primary/10 text-primary', message: 'Master Admin acessou Tenant ', strong: 'TENANT-ILLUMINE-HQ', suffix: '.' },
  ];

  return (
    <ExecutivePageTemplate header={{
      title: "Tenant Governance",
      description: "Visão de Master Admin: Rastreabilidade Cross-Tenant, Isolamento Fiduciário e Permissões.",
    }}>

      <ExecutiveSurface padding="sm" radius="md" className="flex items-center gap-4 flex-wrap mb-6">
        <StatusBadge status="Ativo" label="Master Admin" />
        <StatusBadge status="Verde" label={`${auditLog.length} eventos`} />
      </ExecutiveSurface>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, i) => (
          <ExecutiveMetricCard density="analytical" key={i}
            label={kpi.label}
            value={kpi.value}
            icon={kpi.icon}
            trend={kpi.trend}
          />
        ))}
      </div>

      <div className="mt-12 mb-8 border-t border-border pt-8" />
      <ExecutiveAccordion
        title="Tenant Audit Timeline"
        subtitle="Log de acesso imutável e rastreabilidade cross-tenant."
        variant="analytics"
        defaultExpanded
      >
        {/* Audit Timeline */}
        <div className="card-premium p-10">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
            <div className="w-10 h-10 rounded-md bg-surface-container flex items-center justify-center text-muted-foreground">
              <Activity size={20} />
            </div>
            <div>
              <ExecutiveHeading as="h3" className="text-h3 text-foreground">Tenant Audit Timeline</ExecutiveHeading>
              <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground mt-0.5">Log de Acesso Imutável</ExecutiveText>
            </div>
          </div>

          <div className="space-y-4">
            {auditLog.map((entry, i) => (
              <div key={i} className="flex items-start gap-5 p-4 bg-surface-container rounded-md border border-border">
                <span className="text-[10px] text-muted-foreground font-mono w-20 shrink-0 mt-0.5">{entry.time}</span>
                <span className={`px-2.5 py-0.5 rounded-button text-[10px] font-bold uppercase tracking-wider shrink-0 ${entry.tagColor}`}>
                  {entry.tag}
                </span>
                <span className="text-body-sm text-foreground font-medium leading-relaxed">
                  {entry.message}<strong>{entry.strong}</strong>{entry.suffix}
                </span>
              </div>
            ))}
          </div>
        </div>
        <ExecutiveSummarySection 
          status={{ label: 'Isolamento Homologado', variant: 'success' }}
          question="Como garantir a segurança, permissões e o isolamento de dados entre os tenants?"
          opinion="O comitê fiduciário homologa o isolamento de dados por tenant e as permissões de acesso da plataforma."
          driver="Tenants ativos, rastreabilidade de acessos, ausência de leakage e log de auditoria."
          implication="Proteção jurídica e contratual sobre o sigilo de informações de cada cliente."
          executiveQuestion="As rotinas de auditoria nas matrizes de acesso e logs de troca de workspace estão ativas e documentadas?"
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>
      </ExecutiveAccordion>
    </ExecutivePageTemplate>
  );
}
