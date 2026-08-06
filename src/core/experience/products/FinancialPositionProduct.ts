import { ExecutiveProductSchema } from '../schema/ExecutiveProductSchema';
import { ExecutiveOffice } from '../governance/offices/ExecutiveOffice';
import { ExecutiveProductType } from './ExecutiveProductType';

export const FinancialPositionProduct: ExecutiveProductSchema = {
  id: 'financial.position',
  office: ExecutiveOffice.CFO_OFFICE,
  productType: ExecutiveProductType.INTELLIGENCE_PRODUCT,
  advisoryLevel: 'DIAGNOSTIC',
  decisionAuthority: false,
  canRecommend: false,
  canExecute: false,
  canCreateGovernanceDecision: false,
  purpose: 'Preservar valor econômico, liquidez e sustentabilidade financeira.',
  executiveDecisionSupported: ['Alocação de capital e proteção do balanço patrimonial'],
  hierarchy: [
    { type: 'EXECUTIVE_FINANCIAL_OVERVIEW', components: ['ExecutiveDiagnosticSummarySection'] },
    { type: 'FINANCIAL_DIAGNOSIS', components: ['BalanceSheetLiquiditySection', 'BalanceSheetCapitalStructureSection', 'BalanceSheetWorkingCapitalSection', 'BalanceSheetAssetQualitySection', 'BalanceSheetCapitalEfficiencySection', 'BalanceSheetCapitalPreservationSection'] },
    { type: 'INTELLIGENCE_SIGNALS', components: ['BalanceSheetInstitutionalContextSection', 'BalanceSheetExecutiveSynthesisSection', 'ExecutiveStrategicTensions'] },
    { type: 'HISTORICAL_EVOLUTION', components: ['BalanceSheetEvolutionAnalysisSection', 'BalanceSheetWaterfallChartSection', 'BalanceSheetCompositionChartsSection'] },
    { type: 'EXECUTIVE_QUESTIONS', components: ['BalanceSheetExecutiveQuestionsSection'] },
    { type: 'TECHNICAL_EVIDENCE', components: ['ExecutiveAccordion', 'BalanceSheetAuditLayerSection'] }
  ],
  intelligenceSources: [
    { engine: 'Financial Intelligence Coordinator', context: 'bp' },
    { engine: 'Patrimonial Intelligence Engine', context: 'structural' }
  ],
  confidenceModel: {
    minimumRequired: 'HIGH',
    auditTrailVisible: true
  },
  governance: {
    requiresEvidence: true,
    requiresHumanDecision: false
  }
};


