import { DecisionCommandEnvelope } from './DecisionCommandEnvelope';

export interface ExecutiveTrustLedgerContract {
  readonly ledgerEntryId: string;
  readonly commandEnvelope: DecisionCommandEnvelope;
  readonly approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'BYPASSED';
  readonly approvedByUserId?: string;
  readonly executionStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  readonly ledgerHash: string;
  readonly timestamp: string;
}
