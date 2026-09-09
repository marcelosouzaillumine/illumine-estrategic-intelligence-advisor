import { DecisionSurfaceDefinition } from '../../types';
import { CAPABILITIES } from '../../../domain/authorization/Capabilities';
import { FinancialReviewPattern } from '../../patterns/financial-review.pattern';

export const FINANCIAL_PERFORMANCE_SURFACE: DecisionSurfaceDefinition = {
  id: 'financial-performance',
  officeId: 'cfo-office',
  titleKey: 'workspace.cfo.surfaces.performance.title',
  descriptionKey: 'workspace.cfo.surfaces.performance.description',
  intent: 'analyze',
  capability: CAPABILITIES.FINANCIAL_DASHBOARD_VIEW,
  supportedEngines: ['FinancialGovernanceEngine'],
  supportedAgents: ['ExecutiveAdvisor'],
  defaultLayout: FinancialReviewPattern.layout.id,
  layouts: [
    FinancialReviewPattern.layout
  ]
};
