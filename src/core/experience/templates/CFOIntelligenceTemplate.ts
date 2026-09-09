import { ExecutiveExperienceLayer } from '../constitution/ExecutiveProductDefinition';

/**
 * Blueprint for CFO Office intelligence products.
 * Defines the standard layer progression for all CFO-related executive experiences.
 */
export const CFOIntelligenceTemplate: ExecutiveExperienceLayer[] = [
  { id: 'summary', name: 'Executive Position Summary', order: 5, rootComponentId: 'ExecutivePositionSummaryRoot' },
  { id: 'overview', name: 'Executive Financial Overview', order: 10, rootComponentId: 'FinancialOverviewRoot' },
  { id: 'score', name: 'Financial Position Score', order: 15, rootComponentId: 'FinancialPositionScoreRoot' },
  { id: 'diagnosis', name: 'Financial Diagnosis', order: 20, rootComponentId: 'FinancialDiagnosisRoot' },
  { id: 'signals', name: 'Governance Signals', order: 30, rootComponentId: 'FinancialSignalsRoot' },
  { id: 'historical', name: 'Historical Evolution', order: 40, rootComponentId: 'HistoricalEvolutionRoot' },
  { id: 'questions', name: 'Executive Questions', order: 50, rootComponentId: 'ExecutiveQuestionsRoot' },
  { id: 'evidence', name: 'Technical Evidence', order: 100, rootComponentId: 'TechnicalEvidenceRoot' }
];
