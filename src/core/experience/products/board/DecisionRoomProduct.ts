import { ExecutiveProductSchema } from '../../schema/ExecutiveProductSchema';
import { ExecutiveOffice } from '../../governance/offices/ExecutiveOffice';
import { ExecutiveProductType } from '../ExecutiveProductType';

export const DecisionRoomProduct: ExecutiveProductSchema = {
  id: 'board.decision.room',
  office: ExecutiveOffice.BOARD_INTELLIGENCE,
  productType: ExecutiveProductType.DECISION_PRODUCT,
  advisoryLevel: 'RECOMMENDATION',
  decisionAuthority: true,
  purpose: 'Apresentar alternativas, estruturar cenários e registrar a deliberação fiduciária.',
  executiveDecisionSupported: ['Decisões estratégicas vinculantes', 'Aprovação orçamentária e alocação estrutural'],
  hierarchy: [
    // This is a placeholder hierarchy mapping to theoretical sections for the Board Room
    { type: 'EXECUTIVE_SUMMARY', components: ['DecisionContextCard'] },
    { type: 'STRATEGIC_INTERPRETATION', components: ['StrategicAlternativesPanel', 'ScenarioAnalysisBoard'] },
    { type: 'INTELLIGENCE_DOMAINS', components: ['RiskAssessmentFramework'] },
    { type: 'CFO_QUESTIONS', components: ['RecommendationFramework'] },
    { type: 'TECHNICAL_EVIDENCE', components: ['GovernanceRecordPanel'] }
  ],
  intelligenceSources: [
    { engine: 'Decision Intelligence Coordinator', context: 'decision' }
  ],
  confidenceModel: {
    minimumRequired: 'ABSOLUTE',
    auditTrailVisible: true
  },
  governance: {
    requiresEvidence: true,
    requiresHumanDecision: true
  }
};
