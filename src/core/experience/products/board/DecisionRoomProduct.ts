import { ExecutiveProductDefinition, ExecutiveExperienceLayer } from '../../constitution/ExecutiveProductDefinition';
import { ExecutiveOffice } from '../../governance/offices/ExecutiveOffice';
import { ExecutiveProductType } from '../ExecutiveProductType';

export const decisionLayers: ExecutiveExperienceLayer[] = [
  { id: 'summary', name: 'Executive Summary', order: 10, rootComponentId: 'DecisionContextCard' },
  { id: 'interpretation', name: 'Strategic Interpretation', order: 20, rootComponentId: 'StrategicAlternativesPanel' },
  { id: 'domains', name: 'Governance Domains', order: 30, rootComponentId: 'RiskAssessmentFramework' },
  { id: 'questions', name: 'CFO Questions', order: 50, rootComponentId: 'RecommendationFramework' },
  { id: 'evidence', name: 'Technical Evidence', order: 100, rootComponentId: 'GovernanceRecordPanel' }
];

export const DecisionRoomProduct: ExecutiveProductDefinition = {
  metadata: {
    id: 'board.decision.room',
    purpose: 'Apresentar alternativas, estruturar cenários e registrar a deliberação fiduciária.',
    executiveDecisionSupported: ['Decisões estratégicas vinculantes', 'Aprovação orçamentária e alocação estrutural']
  },
  office: ExecutiveOffice.BOARD_INTELLIGENCE,
  productType: ExecutiveProductType.DECISION_PRODUCT,
  advisoryLevel: 'RECOMMENDATION',
  capabilities: {
    intelligenceSources: [
      { engine: 'Decision Governance Coordinator', context: 'decision' }
    ],
    confidenceModel: {
      minimumRequired: 'ABSOLUTE',
      auditTrailVisible: true
    }
  },
  experience: {
    layers: decisionLayers,
    rules: {
      requiresEvidence: true,
      requiresHumanDecision: true,
      decisionAuthority: true,
      canRecommend: true,
      canExecute: true,
      canCreateGovernanceDecision: true
    }
  }
};
