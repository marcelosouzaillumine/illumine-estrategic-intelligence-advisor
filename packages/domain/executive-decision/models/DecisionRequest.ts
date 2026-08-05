import { DecisionStatus } from '../enums/DecisionStatus';

export interface DecisionContext {
  domainOrigin: 'REVENUE' | 'GOVERNANCE' | 'FINANCIAL' | 'BOARD';
  referenceId: string; // e.g., ProposalVersion ID
  accountId: string;
}

export interface DecisionRequest {
  id: string;
  context: DecisionContext;
  status: DecisionStatus;
  summary: any; // Mapped summary of what is being decided
  commitment: any; // Mapped commitment (financial, operational, etc)
  createdAt: string;
  expiresAt?: string;
}
