import React from 'react';
import { PageHeader, StatusBadge } from '../../../../components/Common';
import { FlaskConical } from 'lucide-react';
import { ScenarioSimulationProvider } from '../../../../context/scenario-simulation/ScenarioSimulationProvider';
import { ScenarioSimulationPanel } from '../../../../components/scenario-simulation/ScenarioSimulationPanel';
import { ExecutiveScenarioNavigator } from '../../../../components/scenario-simulation/ExecutiveScenarioNavigator';
import { GovernanceProjectionTimeline } from '../../../../components/scenario-simulation/GovernanceProjectionTimeline';
import { GovernanceForecastSurface } from '../../../../components/scenario-simulation/GovernanceForecastSurface';
import { StrategicStressMap } from '../../../../components/scenario-simulation/StrategicStressMap';
import { SimulationConfidenceCard } from '../../../../components/scenario-simulation/SimulationConfidenceCard';
import { SimulationLineageViewer } from '../../../../components/scenario-simulation/SimulationLineageViewer';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { ExecutivePageTemplate } from '../../../../components/ui/executive-page-template';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveBadge } from '../../../../components/ui/executive-badge';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { ExecutiveSummarySection } from '../../../../components/ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../../../../components/ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../../../../components/ui/executive-decision-trace';
import { ExecutiveTechnicalLayer } from '../../../../components/ui/executive-technical-layer';
import { useExecutiveScenarioLabPageViewModel } from '../../../../viewmodels/useExecutiveScenarioLabPageViewModel';

export function ExecutiveScenarioLabPage() {
  const { state: vmState, computed: vmComputed, actions: vmActions } = useExecutiveScenarioLabPageViewModel({ clientId: '' });
  const { t } = useLanguage();
  return (
    <ScenarioSimulationProvider>
      <ExecutivePageTemplate header={{
        title: t('scenario.title') || "Laboratório Executivo de Cenários",
        description: t('scenario.subtitle') || "Projete cenários alternativos e simule elasticidades e estresse de governança.",
      }}>
        <div className="max-w-[1440px] mx-auto space-y-8 pb-24 animate-executive-fade">

          {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE LABORATÓRIO DE CENÁRIOS) --- */}
          <ExecutiveSummarySection 
            className="mb-8"
            status={{ label: 'Simulação Homologada', variant: 'success' }}
            question="Qual o impacto e resiliência financeira diante dos cenários simulados de estresse e variação de margem?"
            opinion="O comitê fiduciário homologa os testes de estresse e projeções de sensibilidade para suporte à tomada de decisão executiva."
            driver="Simulações de receita, variação de custos, projeções de caixa e testes de sensibilidade de mercado."
            implication="Mitigação de exposição a choques macroeconômicos ou desvios operacionais não planejados."
            executiveQuestion="Definir gatilhos operacionais para ativação automática do plano de mitigação de liquidez."
          >
            <ExecutiveStrategicTensions tensions={[]} />
            <ExecutiveDecisionTrace trace={[]} />
          </ExecutiveSummarySection>

          {/* --- CAMADA 2: DIRETORIA & SANDBOX E NAVEGADOR --- */}
          <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm mb-8 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <ExecutiveHeading as="h3" className="text-foreground">Sandbox de Simulação de Impactos</ExecutiveHeading>
                <ExecutiveText variant="caption" className="text-muted-foreground">Parâmetros de elasticidade e projeção de sensibilidade.</ExecutiveText>
              </div>
              <ExecutiveBadge variant="info">Laboratório Ativo</ExecutiveBadge>
            </div>

            <ScenarioSimulationPanel />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExecutiveScenarioNavigator />
              <GovernanceProjectionTimeline />
            </div>

            <GovernanceForecastSurface />
          </ExecutiveSurface>

          {/* --- CAMADA 3: CAMADA TÉCNICA E AUDITORIA DE CENÁRIOS --- */}
          <ExecutiveTechnicalLayer
            title="Camada Técnica de Confiança e Linhagem"
            subtitle="Diagnóstico de Confiança, Rastro de Linhagem e Mapa de Estresse"
            description="Métricas estatísticas de intervalo de confiança, hash de linhagem e níveis de severidade de estresse."
            className="mb-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <StrategicStressMap />
              </div>
              <div className="space-y-6">
                <SimulationConfidenceCard />
                <SimulationLineageViewer />
              </div>
            </div>
          </ExecutiveTechnicalLayer>

        </div>
      </ExecutivePageTemplate>
    </ScenarioSimulationProvider>
  );
}
