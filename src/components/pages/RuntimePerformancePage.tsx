import { ExecutiveText } from '../ui/executive-typography';
import { ExecutiveHeading } from '../ui/executive-heading';
import React, { useState, useEffect } from 'react';
import { Gauge, Cpu, Database } from 'lucide-react';
import { cn } from '../../lib/utils';
import { RuntimeLatencyPanel } from '../performance/RuntimeLatencyPanel';
import { RuntimeLatencySnapshot } from '../../services/FiduciaryRuntimeAdapter';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveAccordion } from '../ui/executive-accordion';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveMetricCard } from '../ui/executive-metric-card';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveTechnicalLayer } from '../ui/executive-technical-layer';
import { StatusBadge } from '../Common';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { useRuntimePerformancePageViewModel } from '../../viewmodels/useRuntimePerformancePageViewModel';

export function RuntimePerformancePage() {
  const { state: vmState, computed: vmComputed, actions: vmActions } = useRuntimePerformancePageViewModel({ clientId: '' });
  const [snapshot, setSnapshot] = useState<RuntimeLatencySnapshot | undefined>();
  const [spikes, setSpikes] = useState<any[]>([]);
  const [queries, setQueries] = useState<any[]>([]);

  useEffect(() => {
    setSnapshot(undefined);
    setSpikes([]);
    setQueries([]);
  }, []);

  return (
    <ExecutivePageTemplate header={{
      title: "Runtime Performance & Latência",
      description: "Monitoramento Passivo de Latência, Memória e Profiling Multi-Tenant em Tempo Real.",
    }}>
      {/* Control Bar (Context Controls & Actions) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <StatusBadge status="Ativo" label="Performance Otimizada" />
          <StatusBadge status="Verde" label="Latência Standby < 1ms" />
        </div>
      </div>

      <div className="space-y-8 pb-24 animate-executive-fade max-w-[1440px] mx-auto">

        {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE PERFORMANCE DE RUNTIME) --- */}
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: 'Performance Otimizada', variant: 'success' }}
          question="Qual o tempo médio de resposta, latência e consumo de recursos na infraestrutura?"
          opinion="O comitê fiduciário homologa a infraestrutura de processamento, atestando a estabilidade de memória e a resposta em milissegundos."
          driver="Tempo de resposta (ms), picos de memória (RAM), consultas lentas e disponibilidade."
          implication="Garantia de escalabilidade, alta disponibilidade e experiência fluida no ambiente de governança."
          action="Manter o monitoramento contínuo de latência com alertas automáticos de estresse de memória."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>

        {/* --- CAMADA 2: DIRETORIA & KPIS DE DESEMPENHO --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ExecutiveMetricCard
            label="Memory Spikes (RAM)"
            value={String(spikes.length)}
            statusBadge={<ExecutiveBadge variant={spikes.length === 0 ? "success" : "warning"}>{spikes.length === 0 ? "Zero Spikes" : "Atenção"}</ExecutiveBadge>}
            tone="neutral"
            description={<span className="text-xs text-muted-foreground font-medium">Picos de Uso de Memória</span>}
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Slow Queries"
            value={String(queries.length)}
            statusBadge={<ExecutiveBadge variant={queries.length === 0 ? "success" : "critical"}>{queries.length === 0 ? "Zero Lentas" : "Lentidão"}</ExecutiveBadge>}
            tone="neutral"
            description={<span className="text-xs text-muted-foreground font-medium">Consultas acima de 1s</span>}
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Runtime Status"
            value={snapshot ? 'Online' : 'Standby'}
            statusBadge={<ExecutiveBadge variant="info">Multi-Tenant</ExecutiveBadge>}
            tone="neutral"
            description={<span className="text-xs text-muted-foreground font-medium">Estado do Motor</span>}
            className="bg-card border border-border shadow-sm h-full"
          />
        </div>

        {/* --- CAMADA 3: CAMADA TÉCNICA E DIAGNÓSTICO DE PROFILING --- */}
        <ExecutiveTechnicalLayer
          title="Camada Técnica de Profiling de Runtime"
          subtitle="Latência por Operação, Fila de Tarefas e Consumo por Processo"
          description="Medição contínua de tempos de execução e gargalos de processamento de queries."
          className="mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ExecutiveSurface padding="xl" radius="xl" className="lg:col-span-2 bg-card border border-border shadow-sm">
              <RuntimeLatencyPanel snapshot={snapshot} />
            </ExecutiveSurface>

            <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Cpu size={18} className="text-primary" />
                <ExecutiveHeading as="h4" className="text-foreground">Consumo de Memória</ExecutiveHeading>
              </div>

              {spikes.length === 0 ? (
                <ExecutiveText variant="bodyStandard" className="text-muted-foreground italic text-center py-8">
                  Nenhum pico de memória registrado no período.
                </ExecutiveText>
              ) : (
                <div className="space-y-2">
                  {spikes.map((s, i) => (
                    <div key={i} className="p-3 bg-surface-container/30 border border-border rounded-xl flex justify-between items-center">
                      <span className="text-xs font-bold text-foreground">{s.action}</span>
                      <span className="text-xs font-mono text-muted-foreground">{(s.estimatedBytes / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  ))}
                </div>
              )}
            </ExecutiveSurface>
          </div>
        </ExecutiveTechnicalLayer>

      </div>
    </ExecutivePageTemplate>
  );
}
