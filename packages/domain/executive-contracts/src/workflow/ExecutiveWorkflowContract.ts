import { DecisionCommandEnvelope } from './DecisionCommandEnvelope';
import { ExecutiveTrustLedgerContract } from './ExecutiveTrustLedgerContract';

export interface ExecutiveWorkflowContract {
  readonly workflowId: string;
  readonly companyId: string;
  readonly commandEnvelope: DecisionCommandEnvelope;
  readonly trustLedger: ExecutiveTrustLedgerContract;
  readonly currentStage: 'DECISION_RECEIVED' | 'RISK_ASSESSED' | 'HUMAN_APPROVAL' | 'EXECUTIVE_EXECUTION' | 'OUTCOME_MEASUREMENT';
  readonly isCompleted: boolean;
}

export * from './DecisionCommandEnvelope';
export * from './ExecutiveTrustLedgerContract';
