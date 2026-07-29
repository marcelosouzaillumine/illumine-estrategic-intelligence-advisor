import React from 'react';
import { Activity, ShieldAlert, Zap, Network, ServerCrash, CheckCircle2 } from 'lucide-react';
import { ExecutiveHeading } from '@/components/ui/executive-heading';
import { ExecutivePageTemplate } from '@/components/ui/executive-page-template';
import { ExecutiveSurface } from '@/components/ui/executive-surface';
import { ExecutiveMetricCard } from '@/components/ui/executive-metric-card';
import { ExecutiveBadge } from '@/components/ui/executive-badge';
import { ExecutiveText } from '@/components/ui/executive-typography';

export function InstitutionalObservabilityCenter() {
  return (
    <ExecutivePageTemplate header={{ title: "Runtime Observability Center", description: "Monitoramento em tempo real da integridade sistêmica, governança e estabilidade operacional.", icon: Activity }}>

      {/* Grid de Métricas de Observabilidade */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <ExecutiveMetricCard
          label="Status Geral"
          value="Operacional"
          description="Zero Alertas Críticos"
          tone="success"
          icon={CheckCircle2}
        />

        <ExecutiveMetricCard
          label="Integridade de Governança"
          value="100%"
          description="Zero Quebra de Alçada"
          tone="success"
          icon={ShieldAlert}
        />

        <ExecutiveMetricCard
          label="Continuidade Sistêmica"
          value="99.99%"
          description="Uptime Institucional"
          tone="info"
          icon={ServerCrash}
        />

        <ExecutiveMetricCard
          label="Decisões Processadas"
          value="142"
          description="Últimos 30 dias"
          tone="neutral"
          icon={Network}
        />

      </div>

      {/* Seção Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        
        {/* Painel de Estabilidade Operacional */}
        <ExecutiveSurface variant="default" padding="lg">
          <ExecutiveHeading as="h2" className="text-foreground mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Estabilidade Operacional (Runtime Health)
          </ExecutiveHeading>
          <div className="space-y-4">
            {['Motor Fiduciário', 'Inteligência Financeira', 'Gateway de Conflitos', 'Rastreabilidade de Lineage'].map((service, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-border/40 pb-4 last:border-0 last:pb-0">
                <ExecutiveText as="span" variant="bodyStandard" className="text-foreground">{service}</ExecutiveText>
                <div className="flex items-center gap-3">
                  <ExecutiveText as="span" variant="caption" className="font-mono text-muted-foreground">12ms</ExecutiveText>
                  <ExecutiveBadge variant="success">
                    Saudável
                  </ExecutiveBadge>
                </div>
              </div>
            ))}
          </div>
        </ExecutiveSurface>

        {/* Benchmarking & Cross-Tenant Security */}
        <ExecutiveSurface variant="default" padding="lg">
          <ExecutiveHeading as="h2" className="text-foreground mb-6 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-primary" />
            Segurança de Dados e Isolamento
          </ExecutiveHeading>
          <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-border/40 rounded-xl bg-muted/20">
            <ShieldAlert className="w-10 h-10 text-emerald-500 mb-3 opacity-80" />
            <ExecutiveHeading as="h3" className="text-foreground">Zero Cross-Tenant Leakage</ExecutiveHeading>
            <ExecutiveText as="p" variant="caption" className="text-muted-foreground mt-2 max-w-[280px] leading-relaxed">
              O ambiente institucional opera em strict isolation mode. Todos os acessos auditados.
            </ExecutiveText>
          </div>
        </ExecutiveSurface>

      </div>
    </ExecutivePageTemplate>
  );
}
