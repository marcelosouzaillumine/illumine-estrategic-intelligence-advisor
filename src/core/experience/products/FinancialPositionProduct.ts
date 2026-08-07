import { ExecutiveProductDefinition, ExecutiveExperienceLayer } from '../constitution/ExecutiveProductDefinition';
import { ExecutiveOffice } from '../governance/offices/ExecutiveOffice';
import { ExecutiveProductType } from './ExecutiveProductType';

export const cfoLayers: ExecutiveExperienceLayer[] = [
  { id: 'overview', name: 'Executive Financial Overview', order: 10, rootComponentId: 'FinancialOverviewRoot' },
  { id: 'diagnosis', name: 'Financial Diagnosis', order: 20, rootComponentId: 'FinancialDiagnosisRoot' },
  { id: 'signals', name: 'Intelligence Signals', order: 30, rootComponentId: 'FinancialSignalsRoot' },
  { id: 'historical', name: 'Historical Evolution', order: 40, rootComponentId: 'HistoricalEvolutionRoot' },
  { id: 'questions', name: 'Executive Questions', order: 50, rootComponentId: 'ExecutiveQuestionsRoot' },
  { id: 'evidence', name: 'Technical Evidence', order: 100, rootComponentId: 'TechnicalEvidenceRoot' }
];

export const FinancialPositionProduct: ExecutiveProductDefinition = {
  metadata: {
    id: 'financial.position',
    purpose: 'Preservar valor econômico, liquidez e sustentabilidade financeira.',
    executiveDecisionSupported: ['Alocação de capital e proteção do balanço patrimonial']
  },
  office: ExecutiveOffice.CFO_OFFICE,
  productType: ExecutiveProductType.INTELLIGENCE_PRODUCT,
  advisoryLevel: 'DIAGNOSTIC',
  capabilities: {
    intelligenceSources: [
      { engine: 'Financial Intelligence Coordinator', context: 'bp' },
      { engine: 'Patrimonial Intelligence Engine', context: 'structural' }
    ],
    confidenceModel: {
      minimumRequired: 'HIGH',
      auditTrailVisible: true
    }
  },
  experience: {
    layers: cfoLayers,
    rules: {
      requiresEvidence: true,
      requiresHumanDecision: false,
      decisionAuthority: false,
      canRecommend: false,
      canExecute: false,
      canCreateGovernanceDecision: false
    }
  }
};

