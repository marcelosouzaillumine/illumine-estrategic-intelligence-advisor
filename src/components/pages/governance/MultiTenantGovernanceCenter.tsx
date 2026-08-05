import { ExecutiveText } from '../../ui/executive-typography';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutivePageTemplate } from '../../ui/executive-page-template';
import React from 'react';
import { ShieldCheck, Activity, Users, Database } from 'lucide-react';
import { ExecutiveMetricCard } from '../../ui/executive-metric-card';

export function MultiTenantGovernanceCenter() {
  const kpis = [
    { label: 'Tenants Ativos', value: '1', icon: Database, status: 'neutral' as const, trend: 'Estável' },
    { label: 'Workspaces Operacionais', value: '2', icon: Users, status: 'neutral' as const, trend: 'Estável' },
    { label: 'Execuções Rastreadas', value: '1.042', icon: Activity, status: 'neutral' as const, trend: 'Bullish' },
    { label: 'Leakage Detectado', value: '0', icon: ShieldCheck, status: 'neutral' as const, trend: 'HEALTHY' },
  ];

  const auditLog = [
    { time: '12:45:00', tag: 'SWITCH_WORKSPACE', tagColor: 'bg-secondary/10 text-secondary', message: 'Advisory Team alterou workspace para ', strong: 'WS-DEMO-02', suffix: '. Cache local invalidado.' },
    { time: '12:30:15', tag: 'LOGIN', tagColor: 'bg-primary/10 text-primary', message: 'Master Admin acessou Tenant ', strong: 'TENANT-ILLUMINE-HQ', suffix: '.' },
  ];

  return (
    <ExecutivePageTemplate header={{ title: "Visão de Master Admin: Rastreabilidade Cross-Tenant, Isolamento Fiduciário e Permissões.", description: "Visão de Master Admin: Rastreabilidade Cross-Tenant, Isolamento Fiduciário e Permissões.", icon: ShieldCheck }}>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <ExecutiveMetricCard density="analytical" key={i}
            label={kpi.label}
            value={kpi.value}
            icon={kpi.icon}
            tone={kpi.status}
            description={kpi.trend}
                      />
        ))}
      </div>

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
    </ExecutivePageTemplate>
  );
}
