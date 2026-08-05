import { ProposalActor } from './ProposalActor';
import { ProposalEventType } from '../events/proposal.events';

export interface ProposalAuditLog {
  id: string;
  proposalId: string;
  versionId?: string;
  eventType: ProposalEventType;
  actor: ProposalActor;
  timestamp: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}
