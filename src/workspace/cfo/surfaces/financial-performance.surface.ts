import { DecisionSurfaceDefinition } from '../../types';
import { CAPABILITIES } from '../../../domain/authorization/Capabilities';

export const CFO_FINANCIAL_PERFORMANCE_SURFACE: DecisionSurfaceDefinition = {
  id: 'financial-performance',
  officeId: 'cfo-office',
  titleKey: 'cfo.performance.title',
  descriptionKey: 'cfo.performance.desc',
  intent: 'analyze',
  capability: CAPABILITIES.EXECUTIVE_WORKSPACE_VIEW,
  supportedEngines: ['financial-governance-engine'],
  supportedAgents: ['cfo-agent'],
  defaultLayout: 'cfo-performance-grid',
  layouts: [],
  intelligenceContext: {
    domain: 'finance',
    office: 'cfo',
    decisionQuestions: [
      'Qual o principal risco financeiro?',
      'Onde existe oportunidade de otimização de custos?',
      'Qual decisão deve ser tomada para proteger o EBITDA?'
    ]
  }
};
