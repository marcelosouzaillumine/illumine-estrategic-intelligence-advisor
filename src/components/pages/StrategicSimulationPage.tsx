import React from 'react';
import { Landmark } from 'lucide-react';
import { StrategicSimulationFeed } from '../strategic-simulation/StrategicSimulationFeed';
import { DecisionImpactPanel } from '../strategic-simulation/DecisionImpactPanel';
import { GovernanceTradeoffPanel } from '../strategic-simulation/GovernanceTradeoffPanel';
import { ScenarioComparisonViewer } from '../strategic-simulation/ScenarioComparisonViewer';
import { StrategicStressCascadePanel } from '../strategic-simulation/StrategicStressCascadePanel';
import { InstitutionalResiliencePanel } from '../strategic-simulation/InstitutionalResiliencePanel';
import { DecisionEvidenceViewer } from '../strategic-simulation/DecisionEvidenceViewer';
import { StrategicSimulationTimeline } from '../strategic-simulation/StrategicSimulationTimeline';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { ExecutiveTechnicalLayer } from '../ui/executive-technical-layer';
import { useStrategicSimulationPageViewModel } from '../../viewmodels/useStrategicSimulationPageViewModel';

export function StrategicSimulationPage() {
  const { state: vmState, computed: vmComputed, actions: vmActions } = useStrategicSimulationPageViewModel({ clientId: '' });
  const tenantId = 'TENANT-HQ';

  return (
    <ExecutivePageTemplate header={{
      title: "Simulador Institucional",
      description: "Projete consequências sistêmicas, compare cenários e analise trade-offs fiduciários antes da execução.",
    }}>
      <div className="max-w-[1440px] mx-auto space-y-8 pb-24 animate-executive-fade">

        {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE SIMULAÇÃO E RESILIÊNCIA) --- */}
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: 'Simulador Ativo', variant: 'success' }}
          question="Quais as consequências das decisões estratégicas sob cenários de estresse e choque de liquidez?"
          opinion="O comitê fiduciário homologa o modelo de simulação de liquidez, validando os parâmetros de resiliência e trade-offs operacionais."
          driver="Cenários de estresse, trade-offs operacionais, cascata de riscos e evidências regulatórias."
          implication="Avaliação prévia dos impactos no caixa e na solvência antes da execução de novas diretrizes estratégicas."
          action="Realizar testes de estresse trimestrais para aferir o nível de resiliência institucional sob variações de mercado."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>

        {/* --- CAMADA 2: DIRETORIA & FEED E RESILIÊNCIA --- */}
        <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm mb-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <ExecutiveHeading as="h3" className="text-foreground">Painel de Simulações e Impacto</ExecutiveHeading>
              <ExecutiveText variant="caption" className="text-muted-foreground">Projeções de resiliência e linha do tempo de simulações ativas.</ExecutiveText>
            </div>
            <ExecutiveBadge variant="success">Engine Conectado</ExecutiveBadge>
          </div>

          <StrategicSimulationFeed tenantId={tenantId} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DecisionImpactPanel tenantId={tenantId} />
            <InstitutionalResiliencePanel tenantId={tenantId} />
          </div>

          <GovernanceTradeoffPanel tenantId={tenantId} />
        </ExecutiveSurface>

        {/* --- CAMADA 3: CAMADA TÉCNICA DE EVIDÊNCIAS E CASCATA DE ESTRESSE --- */}
        <ExecutiveTechnicalLayer
          title="Camada Técnica de Estresse e Evidências"
          subtitle="Cascata de Estresse, Comparador de Cenários e Trilha Causal"
          description="Visualização técnica detalhada dos fatores de sensibilidade, matriz de divergência e evidências fiduciárias."
          className="mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <StrategicStressCascadePanel tenantId={tenantId} />
              <ScenarioComparisonViewer tenantId={tenantId} />
            </div>

            <div className="space-y-6">
              <DecisionEvidenceViewer tenantId={tenantId} />
              <StrategicSimulationTimeline tenantId={tenantId} />
            </div>
          </div>
        </ExecutiveTechnicalLayer>

      </div>
    </ExecutivePageTemplate>
  );
}
