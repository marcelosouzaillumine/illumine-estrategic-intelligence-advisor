import React from 'react';
import { ExperienceComponentRegistry } from './ExperienceComponentRegistry';
import { ExecutiveSummarySection } from '../../../components/ui/executive-summary-section';
import { BalanceSheetInstitutionalContextSection } from '../../../components/pages/balance-sheet/BalanceSheetInstitutionalContextSection';
import { BalanceSheetExecutiveSynthesisSection } from '../../../components/pages/balance-sheet/BalanceSheetExecutiveSynthesisSection';
import { ExecutiveStrategicTensions } from '../../../components/ui/executive-strategic-tensions';
import { BalanceSheetCapitalPreservationSection } from '../../../components/pages/balance-sheet/BalanceSheetCapitalPreservationSection';
import { BalanceSheetLiquiditySection } from '../../../components/pages/balance-sheet/BalanceSheetLiquiditySection';
import { BalanceSheetCapitalStructureSection } from '../../../components/pages/balance-sheet/BalanceSheetCapitalStructureSection';
import { BalanceSheetWorkingCapitalSection } from '../../../components/pages/balance-sheet/BalanceSheetWorkingCapitalSection';
import { BalanceSheetAssetQualitySection } from '../../../components/pages/balance-sheet/BalanceSheetAssetQualitySection';
import { BalanceSheetCapitalEfficiencySection } from '../../../components/pages/balance-sheet/BalanceSheetCapitalEfficiencySection';
import { BalanceSheetEvolutionAnalysisSection } from '../../../components/pages/balance-sheet/BalanceSheetEvolutionAnalysisSection';
import { BalanceSheetAuditLayerSection } from '../../../components/pages/balance-sheet/BalanceSheetAuditLayerSection';
import { BalanceSheetTechnicalLayerSection } from '../../../components/pages/balance-sheet/BalanceSheetTechnicalLayerSection';
import { BalanceSheetExecutiveQuestionsSection } from '../../../components/pages/balance-sheet/BalanceSheetExecutiveQuestionsSection';
import { ExecutiveAccordion } from '../../../components/ui/executive-accordion';
import { BarChart3 } from 'lucide-react';
import { BalanceSheetWaterfallChartSection } from '../../../components/pages/balance-sheet/BalanceSheetWaterfallChartSection';
import { ExecutiveExposureCard } from '../../../components/ui/executive-exposure-card';
import { BalanceSheetCompositionChartsSection } from '../../../components/pages/balance-sheet/BalanceSheetCompositionChartsSection';
import { BalanceSheetStructuralTablesSection } from '../../../components/pages/balance-sheet/BalanceSheetStructuralTablesSection';

export function registerBalanceSheetComponents() {
  ExperienceComponentRegistry.register({
    id: 'ExecutiveSummarySection',
    component: (props: any) => {
      const { context } = props;
      const { executiveViewModel } = context.intelligence.financialPosition;
      return (
        <ExecutiveSummarySection 
          className="mb-8"
          status={{ label: 'Balanço Auditado', variant: 'success' }}
          question="Qual a solidez da estrutura patrimonial, nível de liquidez e alavancagem de capital?"
          opinion={executiveViewModel?.executiveOpinion || "O balanço patrimonial foi auditado, atestando a integridade da estrutura de ativos e da posição financeira."}
          driver="Ativo total, passivo oneroso, patrimônio líquido e liquidez corrente."
          implication="A estrutura atual reflete estabilidade, sendo o retorno financeiro condicionado à alocação estratégica."
          executiveQuestion="A estrutura de capital atual otimiza o retorno financeiro sem comprometer a estabilidade do balanço?"
        />
      );
    },
    allowedSections: ['EXECUTIVE_FINANCIAL_OVERVIEW'],
    requiredData: ['financialPosition'],
    governance: { executiveOnly: true }
  });

  ExperienceComponentRegistry.register({
    id: 'BalanceSheetInstitutionalContextSection',
    component: (props: any) => {
      const { context } = props;
      const { executiveViewModel } = context.intelligence.financialPosition;
      return <BalanceSheetInstitutionalContextSection context={executiveViewModel?.institutionalContext} />;
    },
    allowedSections: ['INTELLIGENCE_SIGNALS'],
    requiredData: ['financialPosition'],
    governance: { executiveOnly: true }
  });

  ExperienceComponentRegistry.register({
    id: 'BalanceSheetExecutiveSynthesisSection',
    component: (props: any) => {
      const { context } = props;
      const { executiveViewModel, bpExecutiveAnalysisContext, filterYear } = context.intelligence.financialPosition;
      return (
        <BalanceSheetExecutiveSynthesisSection 
          executiveNarrative={executiveViewModel?.executiveOpinion || 'Nenhuma narrativa disponível para este exercício.'}
          context={bpExecutiveAnalysisContext}
          selectedYear={filterYear}
        />
      );
    },
    allowedSections: ['INTELLIGENCE_SIGNALS'],
    requiredData: ['financialPosition'],
    governance: { executiveOnly: true }
  });

  ExperienceComponentRegistry.register({
    id: 'ExecutiveStrategicTensions',
    component: (props: any) => {
      const { context } = props;
      const { strategicTensions } = context.intelligence.financialPosition;
      if (!strategicTensions || strategicTensions.length === 0) return null;
      return (
        <div className="mt-8 mb-4">
          <ExecutiveStrategicTensions tensions={strategicTensions} />
        </div>
      );
    },
    allowedSections: ['INTELLIGENCE_SIGNALS'],
    requiredData: ['financialPosition'],
    governance: { executiveOnly: true }
  });

  ExperienceComponentRegistry.register({
    id: 'BalanceSheetCapitalPreservationSection',
    component: (props: any) => {
      const { context } = props;
      const { executiveViewModel } = context.intelligence.financialPosition;
      return <BalanceSheetCapitalPreservationSection panel={executiveViewModel?.analysisPanels?.protection} />;
    },
    allowedSections: ['FINANCIAL_DIAGNOSIS'],
    requiredData: ['financialPosition'],
    governance: { executiveOnly: true }
  });

  ExperienceComponentRegistry.register({
    id: 'BalanceSheetLiquiditySection',
    component: (props: any) => {
      const { context } = props;
      const { executiveViewModel } = context.intelligence.financialPosition;
      return <BalanceSheetLiquiditySection panel={executiveViewModel?.analysisPanels?.liquidity} />;
    },
    allowedSections: ['FINANCIAL_DIAGNOSIS'],
    requiredData: ['financialPosition'],
    governance: { executiveOnly: true }
  });

  ExperienceComponentRegistry.register({
    id: 'BalanceSheetCapitalStructureSection',
    component: (props: any) => {
      const { context } = props;
      const { bpSummary, patrimonialIntelligenceReport } = context.intelligence.financialPosition;
      return <BalanceSheetCapitalStructureSection bpSummary={bpSummary} diagnostics={patrimonialIntelligenceReport} />;
    },
    allowedSections: ['FINANCIAL_DIAGNOSIS'],
    requiredData: ['financialPosition'],
    governance: { executiveOnly: true }
  });

  ExperienceComponentRegistry.register({
    id: 'BalanceSheetWorkingCapitalSection',
    component: (props: any) => {
      const { context } = props;
      const { bpSummary, patrimonialIntelligenceReport } = context.intelligence.financialPosition;
      return <BalanceSheetWorkingCapitalSection bpSummary={bpSummary} diagnostics={patrimonialIntelligenceReport} />;
    },
    allowedSections: ['FINANCIAL_DIAGNOSIS'],
    requiredData: ['financialPosition'],
    governance: { executiveOnly: true }
  });

  ExperienceComponentRegistry.register({
    id: 'BalanceSheetAssetQualitySection',
    component: (props: any) => {
      const { context } = props;
      const { bpSummary, patrimonialIntelligenceReport } = context.intelligence.financialPosition;
      return <BalanceSheetAssetQualitySection bpSummary={bpSummary} diagnostics={patrimonialIntelligenceReport} />;
    },
    allowedSections: ['FINANCIAL_DIAGNOSIS'],
    requiredData: ['financialPosition'],
    governance: { executiveOnly: true }
  });

  ExperienceComponentRegistry.register({
    id: 'BalanceSheetCapitalEfficiencySection',
    component: (props: any) => {
      const { context } = props;
      const { executiveViewModel } = context.intelligence.financialPosition;
      return <BalanceSheetCapitalEfficiencySection panel={executiveViewModel?.analysisPanels?.capitalEfficiency} />;
    },
    allowedSections: ['FINANCIAL_DIAGNOSIS'],
    requiredData: ['financialPosition'],
    governance: { executiveOnly: true }
  });

  ExperienceComponentRegistry.register({
    id: 'BalanceSheetEvolutionAnalysisSection',
    component: (props: any) => {
      const { context } = props;
      const { financialAnalyticsViewModel } = context.intelligence.financialPosition;
      if (!financialAnalyticsViewModel?.evolution?.chartData?.length) return null;
      return (
        <BalanceSheetEvolutionAnalysisSection 
          viewModel={financialAnalyticsViewModel.evolution}
          formatCurrency={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value || 0)}
        />
      );
    },
    allowedSections: ['HISTORICAL_EVOLUTION'],
    requiredData: ['financialPosition'],
    governance: { executiveOnly: true }
  });

  ExperienceComponentRegistry.register({
    id: 'BalanceSheetExecutiveQuestionsSection',
    component: (props: any) => {
      const { context } = props;
      const { executiveViewModel } = context.intelligence.financialPosition;
      return (
        <BalanceSheetExecutiveQuestionsSection 
          triggers={executiveViewModel?.executiveQuestions || []}
        />
      );
    },
    allowedSections: ['EXECUTIVE_QUESTIONS'],
    requiredData: ['financialPosition'],
    governance: { executiveOnly: true }
  });

  ExperienceComponentRegistry.register({
    id: 'BalanceSheetAuditLayerSection',
    component: (props: any) => {
      const { context } = props;
      const { executiveViewModel } = context.intelligence.financialPosition;
      return (
        <BalanceSheetAuditLayerSection 
          viewModel={executiveViewModel?.auditLayer}
          evidenceTrace={executiveViewModel?.evidenceTrace}
        />
      );
    },
    allowedSections: ['TECHNICAL_EVIDENCE'],
    requiredData: ['financialPosition'],
    governance: { executiveOnly: true }
  });

  ExperienceComponentRegistry.register({
    id: 'ExecutiveAccordion',
    component: (props: any) => {
      const { context } = props;
      const { financialAnalyticsViewModel, bpSummary, executiveViewModel } = context.intelligence.financialPosition;
      return (
        <ExecutiveAccordion
          variant="analytics"
          defaultExpanded={false}
          title="Memória Analítica e Evidências Técnicas (Contabilidade Bruta)"
          subtitle="Análises horizontais, verticais, tabelas estruturais e visualizações técnicas."
        >
          <div className="space-y-12 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <BalanceSheetWaterfallChartSection 
                viewModel={financialAnalyticsViewModel?.waterfall} 
                formatCurrency={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value || 0)}
              />
              <ExecutiveExposureCard
                title="Mapa de Calor: Concentração"
                subtitle="Concentração de Capital de Giro"
                metrics={[
                  {
                    label: 'Estoque / Ativo Circulante',
                    percentage: bpSummary && bpSummary.ativoCirculante > 0 ? (bpSummary.estoques / bpSummary.ativoCirculante) * 100 : 0,
                    colorClass: 'bg-warning'
                  },
                  {
                    label: 'Dívida CP / Passivo Total',
                    percentage: bpSummary && bpSummary.passivoTotal > 0 ? (bpSummary.passivoCirculante / bpSummary.passivoTotal) * 100 : 0,
                    colorClass: 'bg-critical'
                  },
                  {
                    label: 'PL / Ativo Total (Autonomia)',
                    percentage: bpSummary && bpSummary.ativoTotal > 0 ? (bpSummary.patrimonioLiquido / bpSummary.ativoTotal) * 100 : 0,
                    colorClass: 'bg-insight'
                  }
                ]}
              />
              <BalanceSheetCompositionChartsSection 
                viewModel={financialAnalyticsViewModel?.composition}
                formatCurrency={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value || 0)}
              />
            </div>
            <BalanceSheetStructuralTablesSection viewModel={financialAnalyticsViewModel?.structuralTables} />
            <div className="pt-8 border-t border-border">
              <BalanceSheetTechnicalLayerSection viewModel={executiveViewModel?.technicalLayer} />
            </div>
          </div>
        </ExecutiveAccordion>
      );
    },
    allowedSections: ['TECHNICAL_EVIDENCE'],
    requiredData: ['financialPosition'],
    governance: { executiveOnly: true }
  });
}
