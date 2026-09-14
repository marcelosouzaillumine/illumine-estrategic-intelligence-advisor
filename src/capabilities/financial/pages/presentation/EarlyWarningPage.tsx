import React from 'react';
import { Siren } from 'lucide-react';
import { EarlyWarningFeed } from '../../../../components/early-warning/EarlyWarningFeed';
import { PredictiveRiskPanel } from '../../../../components/early-warning/PredictiveRiskPanel';
import { GovernanceTrendPanel } from '../../../../components/early-warning/GovernanceTrendPanel';
import { BenchmarkDeviationPanel } from '../../../../components/early-warning/BenchmarkDeviationPanel';
import { ScenarioDeteriorationPanel } from '../../../../components/early-warning/ScenarioDeteriorationPanel';
import { GraphPatternAlertPanel } from '../../../../components/early-warning/GraphPatternAlertPanel';
import { WarningEvidenceViewer } from '../../../../components/early-warning/WarningEvidenceViewer';
import { EarlyWarningTimeline } from '../../../../components/early-warning/EarlyWarningTimeline';
import { ExecutivePageTemplate } from '../../../../components/ui/executive-page-template';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveAccordion } from '../../../../components/ui/executive-accordion';
import { ExecutiveEmptyState } from '../../../../components/ui/executive-empty-state';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { StatusBadge } from '../../../../components/Common';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../../../../components/ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../../../../components/ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../../../../components/ui/executive-decision-trace';
import { useEarlyWarningPageViewModel } from '../../../../viewmodels/useEarlyWarningPageViewModel';




export function EarlyWarningPage() {
  // Adapter: useEarlyWarningPageAdapter
  // ViewModel: useEarlyWarningPageViewModel
  const { state: vmState, computed: vmComputed, actions: vmActions } = useEarlyWarningPageViewModel({ clientId: '' });
  const portal = createPortal;
  const tenantId = 'TENANT-HQ'; // Mock MVP Tenant

  return (
    <ExecutivePageTemplate header={{
      title: "Early Warning System (Radar de Riscos)",
      description: "Detecção antecipada de deterioração financeira baseada no Knowledge Graph, Benchmarking e Workflows.",
    }}>

      {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE ALERTAS PRECOCES) --- */}
      <ExecutiveSummarySection 
        className="mb-8"
        status={{ label: 'Radar Preditivo Ativo', variant: 'success' }}
        question="Quais os alertas precoces de deterioração financeira e operacional detectados?"
        opinion="O comitê fiduciário homologa os sinais de alerta e recomenda ações preventivas antes da consumação do risco."
        driver="Padrões do Knowledge Graph, desvios de benchmark e tendências de solvência."
        implication="Prevenção de crises de liquidez e preservação da continuidade operacional."
        executiveQuestion="Executar os planos de contingência associados aos alertas de maior severidade."
      >
        <ExecutiveStrategicTensions tensions={[]} />
        <ExecutiveDecisionTrace trace={[]} />
      </ExecutiveSummarySection>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

        <div className="flex items-center gap-3">
          <StatusBadge status="Verde" label="Radar Ativo" />
        </div>
      
      </div>

      <div className="mt-12 mb-8 border-t border-border pt-8" />
      <ExecutiveAccordion
        title="Painel Geral de Alertas e Sinais"
        subtitle="Analise tendências de governança, riscos preditivos e desvios de benchmark."
        variant="analytics"
        defaultExpanded
      >

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <EarlyWarningFeed tenantId={tenantId} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GovernanceTrendPanel tenantId={tenantId} />
            <PredictiveRiskPanel tenantId={tenantId} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BenchmarkDeviationPanel tenantId={tenantId} />
            <ScenarioDeteriorationPanel tenantId={tenantId} />
          </div>

          <GraphPatternAlertPanel tenantId={tenantId} />
        </div>

        <div className="space-y-6">
          <WarningEvidenceViewer tenantId={tenantId} />
          <EarlyWarningTimeline tenantId={tenantId} />
        </div>
      </div>
      </ExecutiveAccordion>
    </ExecutivePageTemplate>
  );
}
