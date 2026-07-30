import { ExecutiveDecisionContext } from '../decision/ExecutiveDecisionContext';

export interface DecisionMemoryContract {
  readonly decisionId: string;
  readonly companyId: string;
  readonly companyName: string;
  readonly decisionTitle: string;
  readonly timestamp: string;
  readonly context: ExecutiveDecisionContext;
  readonly recommendationText: string;
  readonly approvedActionText?: string;
  readonly expectedImpactValue: number;
  readonly actualOutcomeValue?: number;
  readonly variancePercent?: number;
  readonly status: 'PENDING_EXECUTION' | 'IN_PROGRESS' | 'COMPLETED' | 'EVALUATED';
}
