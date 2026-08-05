import React from 'react';
import { InstitutionalStrategicIntelligenceCenter } from '../strategic-intelligence/InstitutionalStrategicIntelligenceCenter';
import { InstitutionalExecutiveCommandRuntime, InstitutionalOperationalGovernanceRuntime, InstitutionalStrategicIntelligenceRuntime } from '../../services/FiduciaryRuntimeAdapter';
import { SystemicIntelligencePanel } from './SystemicIntelligencePanel';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { ExecutiveTechnicalLayer } from '../ui/executive-technical-layer';
import { useInstitutionalStrategicIntelligencePageViewModel } from '../../viewmodels/useInstitutionalStrategicIntelligencePageViewModel';

export function InstitutionalStrategicIntelligencePage({ clients, selectedClient, selectedMonth, selectedYear }: any) {
  const { state: vmState, computed: vmComputed, actions: vmActions } = useInstitutionalStrategicIntelligencePageViewModel({ clientId: selectedClient });
  
  const dummyReport: any = {
    metadata: { lineageHash: 'STR-7729-A1B2', historicalCyclesCount: 5 },
    institutionalContext: { tenantId: 'sandbox', currentCycle: '2026-05' },
    capitalStructure: { fundingDependenceLevel: 'MODERATE', rolloverRisk: 'LOW' },
    metrics: {
      financialMetrics: { ocf: 450, revenue: 15000 },
      scaleEfficiency: { recGrowth: 0.12, ebitdaGrowth: 0.15 }
    },
    resilienceReport: { status: 'SAFE' },
    treasuryIntelligenceReport: { stressStatus: 'STABLE' },
    operatingPressureReport: { structuralPressureSeverity: 'MODERATE' },
    executiveCommand: { activeDirectives: [] },
    operationalGovernance: {
      executionIntegrity: { status: 'EXECUTION_STABLE' }
    }
  };

  const strategicOutput = InstitutionalStrategicIntelligenceRuntime.evaluate(dummyReport);

  return (
    <ExecutivePageTemplate header={{
      title: "Inteligência Estratégica Institucional",
      description: "Painel integrado de eficiência operacional, resiliência financeira e governança C-Level.",
    }}>
      <div className="space-y-8 pb-24 animate-executive-fade max-w-[1440px] mx-auto">

        {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE INTELIGÊNCIA ESTRATÉGICA) --- */}
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: 'Inteligência Ativa', variant: 'success' }}
          question="Como a inteligência estratégica integrada orienta as decisões do Conselho e C-Level?"
          opinion="O comitê fiduciário homologa os diagnósticos de eficiência de escala e governança como direcionadores fiduciários soberanos."
          driver="Eficiência de escala, resiliência de caixa, alavancagem estrutural e diretrizes executivas."
          implication="Alinhamento perfeito entre estratégia de longo prazo e execução operacional diária."
          executiveQuestion="Executar as diretrizes de otimização de capital acordadas no comitê de governança."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>

        {/* --- CAMADA 2: DIRETORIA & CENTRO DE INTELIGÊNCIA --- */}
        <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm mb-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <ExecutiveHeading as="h3" className="text-foreground">Centro de Inteligência Estratégica</ExecutiveHeading>
              <ExecutiveText variant="caption" className="text-muted-foreground">Avaliação sistêmica de resiliência e saúde da governança.</ExecutiveText>
            </div>
            <ExecutiveBadge variant="success">Engine Avaliado</ExecutiveBadge>
          </div>

          <InstitutionalStrategicIntelligenceCenter data={strategicOutput} />
        </ExecutiveSurface>

        {/* --- CAMADA 3: CAMADA TÉCNICA E PAINEL SISTÊMICO --- */}
        <ExecutiveTechnicalLayer
          title="Camada Técnica de Inteligência Sistêmica"
          subtitle="Diagnóstico de Rastreabilidade e Linhagem de Decisão"
          description="Mapeamento analítico de indicadores operacionais e interdependências fiduciárias."
          className="mb-8"
        >
          <ExecutiveSurface padding="xl" radius="xl" className="bg-card border border-border shadow-sm">
            <SystemicIntelligencePanel clientId={selectedClient} selectedMonth={selectedMonth} selectedYear={selectedYear} />
          </ExecutiveSurface>
        </ExecutiveTechnicalLayer>

      </div>
    </ExecutivePageTemplate>
  );
}
