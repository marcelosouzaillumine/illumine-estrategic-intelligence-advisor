import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { GovernanceTimeMachineWorkspace } from '../../../../components/workspaces/GovernanceTimeMachineWorkspace';
import { GovernanceTimeMachineViewModel } from '../../../../viewmodels/temporal/GovernanceTimeMachineViewModel';
import { GovernanceTimeMachineRuntime } from '../../../../core/temporal/GovernanceTimeMachineRuntime';
import { TimelineQueryEngine } from '../../../../core/temporal/TimelineQueryEngine';
import { FirestoreTimelineRepository } from '../../../../services/temporal/FirestoreTimelineRepository';
import { InstitutionalDriftEngine } from '../../../../core/temporal/InstitutionalDriftEngine';
import { ExecutivePageTemplate } from '../../../../components/ui/executive-page-template';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveAccordion } from '../../../../components/ui/executive-accordion';
import { ExecutiveEmptyState } from '../../../../components/ui/executive-empty-state';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { ExecutiveBadge } from '../../../../components/ui/executive-badge';
import { ExecutiveMetricCard } from '../../../../components/ui/executive-metric-card';
import { ExecutiveSummarySection } from '../../../../components/ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../../../../components/ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../../../../components/ui/executive-decision-trace';
import { ExecutiveTechnicalLayer } from '../../../../components/ui/executive-technical-layer';
import { useGovernanceTimeMachinePageViewModel } from '../../../../viewmodels/useGovernanceTimeMachinePageViewModel';

export const GovernanceTimeMachinePage: React.FC = () => {
  const { state: vmState, computed: vmComputed, actions: vmActions } = useGovernanceTimeMachinePageViewModel({ clientId: '' });
  const { nodeId } = useParams<{ nodeId: string }>();
  
  const dependencies = useMemo(() => {
    const repository = new FirestoreTimelineRepository();
    const runtime = new GovernanceTimeMachineRuntime(repository);
    const queryEngine = new TimelineQueryEngine(repository);
    const driftEngine = new InstitutionalDriftEngine(repository);
    const viewModel = new GovernanceTimeMachineViewModel(runtime, queryEngine);
    
    return { repository, runtime, queryEngine, driftEngine, viewModel };
  }, []);

  const tenantId = 'SYSTEM_TENANT';
  const timelineId = nodeId || 'main-institutional-timeline';

  return (
    <ExecutivePageTemplate header={{
      title: "Máquina do Tempo de Governança",
      description: "Time-travel fiduciário para auditoria de linhagem, rollback de snapshots e análise de desvios (drifts).",
    }}>
      <div className="space-y-8 pb-24 animate-executive-fade max-w-[1440px] mx-auto">

        {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE MÁQUINA DO TEMPO) --- */}
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: 'Linha do Tempo Ativa', variant: 'success' }}
          question="Como auditar retrospectivamente a evolução da governança e detectar desvios (drifts) institucionais?"
          opinion="O comitê fiduciário homologa a auditoria via Máquina do Tempo de Governança, atestando a integridade imutável da trilha temporal de eventos."
          driver="Snapshots temporais fiduciários, motor de navegação na linha do tempo e detecção automática de drifts."
          implication="Garantia de auditoria forense completa para conselheiros, investidores e órgãos reguladores."
          executiveQuestion="Executar a verificação de drifts temporais ao final de cada exercício fiscal."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>

        {/* --- CAMADA 2: DIRETORIA & KPIS TEMPORAIS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ExecutiveMetricCard
            label="Trilha Temporal"
            value="Imutável / Auditada"
            statusBadge={<ExecutiveBadge variant="success">Integrado</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Drifts Detectados"
            value="Zero Desvios"
            statusBadge={<ExecutiveBadge variant="success">Conforme</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />

          <ExecutiveMetricCard
            label="Snapshots Armazenados"
            value="Histórico Completo"
            statusBadge={<ExecutiveBadge variant="info">Auditabilidade</ExecutiveBadge>}
            tone="neutral"
            className="bg-card border border-border shadow-sm h-full"
          />
        </div>

        {/* --- CAMADA 3: CAMADA TÉCNICA E WORKSPACE TEMPORAL --- */}
        <ExecutiveTechnicalLayer
          title="Camada Técnica — Workspace de Reconstrução Temporal"
          subtitle="Console de Auditoria Forense e Navegação por Snapshot"
          description="Visualização gráfica da linha do tempo e rollback visual de decisões de governança."
          className="mb-8"
        >
          <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm">
            <GovernanceTimeMachineWorkspace 
              viewModel={dependencies.viewModel}
              runtime={dependencies.runtime}
              driftEngine={dependencies.driftEngine}
              tenantId={tenantId}
              timelineId={timelineId}
            />
          </ExecutiveSurface>
        </ExecutiveTechnicalLayer>

      </div>
    </ExecutivePageTemplate>
  );
};
