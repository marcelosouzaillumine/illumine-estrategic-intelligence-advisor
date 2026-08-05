import { DecisionSurfaceDefinition } from '../../types';
import { CAPABILITIES } from '../../../domain/authorization/Capabilities';

export const CFO_CASH_INTELLIGENCE_SURFACE: DecisionSurfaceDefinition = {
  id: 'cash-intelligence',
  officeId: 'cfo-office',
  titleKey: 'cfo.cash.title',
  descriptionKey: 'cfo.cash.desc',
  intent: 'analyze',
  capability: CAPABILITIES.EXECUTIVE_WORKSPACE_VIEW,
  supportedEngines: ['financial-intelligence-engine'],
  supportedAgents: ['cfo-agent'],
  defaultLayout: 'cfo-cash-grid',
  layouts: [],
  intelligenceContext: {
    domain: 'finance',
    office: 'cfo',
    decisionQuestions: [
      'Qual o risco de liquidez nos próximos 90 dias?',
      'O ciclo financeiro está pressionando o caixa livre?',
      'Quais contas devem ser antecipadas ou postergadas?'
    ]
  }
};
