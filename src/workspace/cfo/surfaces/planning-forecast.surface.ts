import { DecisionSurfaceDefinition } from '../../types';
import { CAPABILITIES } from '../../../domain/authorization/Capabilities';

export const CFO_PLANNING_FORECAST_SURFACE: DecisionSurfaceDefinition = {
  id: 'planning-forecast',
  officeId: 'cfo-office',
  titleKey: 'cfo.planning.title',
  descriptionKey: 'cfo.planning.desc',
  intent: 'plan',
  capability: CAPABILITIES.EXECUTIVE_WORKSPACE_VIEW,
  supportedEngines: ['financial-intelligence-engine'],
  supportedAgents: ['cfo-agent'],
  defaultLayout: 'cfo-planning-grid',
  layouts: [],
  intelligenceContext: {
    domain: 'finance',
    office: 'cfo',
    decisionQuestions: [
      'Qual o maior desvio orçamentário do período atual?',
      'O forecast aponta para atingimento da meta anual?',
      'Quais áreas requerem revisão de budget?'
    ]
  }
};
