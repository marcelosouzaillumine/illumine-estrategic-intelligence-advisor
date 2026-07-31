import { OperationalRole } from '../../executive-identity-context/src/ExecutiveIdentityContext';

export interface ExecutiveConversationContext {
  conversationId: string;
  tenantId: string;
  organizationId: string;
  userId: string;
  operationalRole: OperationalRole;
  sessionId: string;
  identityValidatedAt: Date;
  createdAt: Date;
  lastInteractionAt: Date;
}
