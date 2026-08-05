import React, { useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { InstitutionalDigitalTwinWorkspace } from '../digital-twin/InstitutionalDigitalTwinWorkspace';
import { InstitutionalDigitalTwinRuntime } from '../../core/digital-twin/InstitutionalDigitalTwinRuntime';
import { TwinAssemblyEngine } from '../../core/digital-twin/TwinAssemblyEngine';
import { FirestoreTwinRepository } from '../../services/digital-twin/FirestoreTwinRepository';
import { InstitutionalObservabilityRegistry } from '../../core/observability/InstitutionalObservabilityRegistry';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveAccordion } from '../ui/executive-accordion';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveMetricCard } from '../ui/executive-metric-card';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { ExecutiveTechnicalLayer } from '../ui/executive-technical-layer';
import { useInstitutionalDigitalTwinPageViewModel } from '../../viewmodels/useInstitutionalDigitalTwinPageViewModel';

export const InstitutionalDigitalTwinPage: React.FC = () => {
  const { state: vmState, computed: vmComputed, actions: vmActions } = useInstitutionalDigitalTwinPageViewModel({ clientId: '' });
  const { domainId } = useParams<{ domainId: string }>();
  
  const dependencies = useMemo(() => {
    const repository = new FirestoreTwinRepository();
    const runtime = new InstitutionalDigitalTwinRuntime(repository);
    const assemblyEngine = new TwinAssemblyEngine(repository);
    return { runtime, assemblyEngine };
  }, []);

  const tenantId = 'SYSTEM_TENANT';
  const userId = 'CURRENT_USER';

  return (
    <ExecutivePageTemplate header={{
      title: "Gêmeo Digital Institucional",
      description: "Simulação matemática em tempo real de impactos operacionais, financeiros e de governança.",
    }}>
      <div className="space-y-8 pb-24 animate-executive-fade max-w-[1440px] mx-auto">

        {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE GÊMEO DIGITAL) --- */}
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: 'Gêmeo Ativo & Sincronizado', variant: 'success' }}
          question="Como a réplica matemática (Gêmeo Digital) projeta os impactos de decisões operacionais complexas?"
          opinion="O comitê fiduciário homologa a simulação via Gêmeo Digital, recomendando a execução de testes de estresse em ambiente sandbox prévio."
          driver="Grafo de entidades corporativas, simulador de estresse, motor de montagem e métricas de fidelidade."
          implication="Mitigação de riscos em reestruturações de processos ou mudanças na alocação de capital."
          executiveQuestion="Utilizar o workspace para validar qualquer alteração estrutural antes de sua aplicação em produção."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>

        {/* --- CAMADA 2: DIRETORIA & KPIS DE SIMULAÇÃO --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ExecutiveMetricCard
            label="Estado do Modelo"
            value="Sincronizado"
            statusBadge={<ExecutiveBadge variant="success">Tempo Real</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Grau de Fidelidade"
            value="99.4%"
            statusBadge={<ExecutiveBadge variant="info">Alta Precisão</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Ambiente Sandbox"
            value="Habilitado"
            statusBadge={<ExecutiveBadge variant="neutral">Simulação Isolada</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />
        </div>

        {/* --- CAMADA 3: CAMADA TÉCNICA E WORKSPACE DE SIMULAÇÃO --- */}
        <ExecutiveTechnicalLayer
          title="Camada Técnica — Workspace do Gêmeo Digital"
          subtitle="Simulador de Estresse Operacional e Grafo de Dependências"
          description="Montagem de réplica digital e teste de hipóteses sem alteração do ambiente ativo."
          className="mb-8"
        >
          <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm">
            <InstitutionalDigitalTwinWorkspace 
              runtime={dependencies.runtime}
              assemblyEngine={dependencies.assemblyEngine}
              tenantId={tenantId}
            />
          </ExecutiveSurface>
        </ExecutiveTechnicalLayer>

      </div>
    </ExecutivePageTemplate>
  );
};
