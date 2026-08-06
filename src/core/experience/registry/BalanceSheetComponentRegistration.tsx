import React from 'react';
import { ExperienceComponentRegistry } from './ExperienceComponentRegistry';
import { ExecutiveDiagnosticSummarySection } from '../../../components/ui/executive-diagnostic-summary-section';
import { BalanceSheetLiquiditySection } from '../../../components/pages/balance-sheet/BalanceSheetLiquiditySection';
import { BalanceSheetCapitalStructureSection } from '../../../components/pages/balance-sheet/BalanceSheetCapitalStructureSection';
import { BalanceSheetWorkingCapitalSection } from '../../../components/pages/balance-sheet/BalanceSheetWorkingCapitalSection';
import { BalanceSheetAssetQualitySection } from '../../../components/pages/balance-sheet/BalanceSheetAssetQualitySection';
import { BalanceSheetExecutiveQuestionsSection } from '../../../components/pages/balance-sheet/BalanceSheetExecutiveQuestionsSection';
import { ExecutiveAccordion } from '../../../components/ui/executive-accordion';
import { BalanceSheetTechnicalLayerSection } from '../../../components/pages/balance-sheet/BalanceSheetTechnicalLayerSection';

export function registerBalanceSheetComponents() {
  ExperienceComponentRegistry.register({
    id: 'ExecutiveDiagnosticSummarySection',
    component: (props: any) => {
      const { context } = props;
      const { pureViewModel } = context.intelligence.financialPosition;
      return (
        <ExecutiveDiagnosticSummarySection 
          className="mb-8"
          status={{ label: 'Balanço Patrimonial', variant: pureViewModel?.overview?.healthStatus === 'HEALTHY' ? 'success' : 'neutral' }}
          question="O que a estrutura patrimonial indica sobre a situação atual da organização?"
          observation={pureViewModel?.overview?.observation || "Estrutura patrimonial apresentada para interpretação fiduciária."}
          evidence={pureViewModel?.overview?.evidence || ""}
          financialMeaning={pureViewModel?.overview?.financialMeaning || ""}
        />
      );
    },
    allowedSections: ['EXECUTIVE_FINANCIAL_OVERVIEW'],
    requiredData: ['financialPosition'],
    governance: { executiveOnly: true }
  });

  ExperienceComponentRegistry.register({
    id: 'BalanceSheetLiquiditySection',
    component: (props: any) => {
      const { context } = props;
      const { pureViewModel } = context.intelligence.financialPosition;
      return <BalanceSheetLiquiditySection indicators={pureViewModel?.diagnosis?.liquidity || []} />;
    },
    allowedSections: ['FINANCIAL_DIAGNOSIS'],
    requiredData: ['financialPosition'],
    governance: { executiveOnly: true }
  });

  ExperienceComponentRegistry.register({
    id: 'BalanceSheetCapitalStructureSection',
    component: (props: any) => {
      const { context } = props;
      const { pureViewModel } = context.intelligence.financialPosition;
      return <BalanceSheetCapitalStructureSection indicators={pureViewModel?.diagnosis?.capitalStructure || []} />;
    },
    allowedSections: ['FINANCIAL_DIAGNOSIS'],
    requiredData: ['financialPosition'],
    governance: { executiveOnly: true }
  });

  ExperienceComponentRegistry.register({
    id: 'BalanceSheetWorkingCapitalSection',
    component: (props: any) => {
      const { context } = props;
      const { pureViewModel } = context.intelligence.financialPosition;
      return <BalanceSheetWorkingCapitalSection indicators={pureViewModel?.diagnosis?.workingCapital || []} />;
    },
    allowedSections: ['FINANCIAL_DIAGNOSIS'],
    requiredData: ['financialPosition'],
    governance: { executiveOnly: true }
  });

  ExperienceComponentRegistry.register({
    id: 'BalanceSheetAssetQualitySection',
    component: (props: any) => {
      const { context } = props;
      const { pureViewModel } = context.intelligence.financialPosition;
      return <BalanceSheetAssetQualitySection indicators={pureViewModel?.diagnosis?.assetQuality || []} />;
    },
    allowedSections: ['FINANCIAL_DIAGNOSIS'],
    requiredData: ['financialPosition'],
    governance: { executiveOnly: true }
  });

  ExperienceComponentRegistry.register({
    id: 'BalanceSheetExecutiveQuestionsSection',
    component: (props: any) => {
      const { context } = props;
      const { pureViewModel } = context.intelligence.financialPosition;
      return (
        <BalanceSheetExecutiveQuestionsSection 
          triggers={pureViewModel?.executiveQuestions || []}
        />
      );
    },
    allowedSections: ['EXECUTIVE_QUESTIONS'],
    requiredData: ['financialPosition'],
    governance: { executiveOnly: true }
  });

  ExperienceComponentRegistry.register({
    id: 'ExecutiveAccordion',
    component: (props: any) => {
      const { context } = props;
      const { pureViewModel } = context.intelligence.financialPosition;
      return (
        <ExecutiveAccordion
          variant="analytics"
          defaultExpanded={false}
          title="Memória Analítica e Evidências Técnicas (Contabilidade Bruta)"
          subtitle="Análises horizontais, verticais, tabelas estruturais e visualizações técnicas."
        >
          <div className="space-y-12 mt-6">
            <BalanceSheetTechnicalLayerSection viewModel={pureViewModel?.technicalEvidence || []} />
          </div>
        </ExecutiveAccordion>
      );
    },
    allowedSections: ['TECHNICAL_EVIDENCE'],
    requiredData: ['financialPosition'],
    governance: { executiveOnly: true }
  });
}
