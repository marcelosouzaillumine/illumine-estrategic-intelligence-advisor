import { ExecutiveDecisionContext } from '../decision/ExecutiveDecisionContext';

export interface ExecutiveAdvisoryOpportunity {
  readonly opportunityId: string;
  readonly companyId: string;
  readonly decisionContext: ExecutiveDecisionContext;
  readonly detectedSignal: string;
  readonly businessImpact: number;
  readonly urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  readonly confidenceLevel: number;
  readonly affectedKPIs: readonly string[];
  readonly recommendedDecisionDate: string;
}
