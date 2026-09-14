import { ExecutiveIdentityContext } from '../../executive-identity-context/src/ExecutiveIdentityContext';
import { ExecutiveConversationContext } from './ExecutiveConversationContext';
import { ExecutiveConversationIsolationViolationError } from './ExecutiveConversationIsolationViolationError';

export class ExecutiveConversationIsolationGuard {
  /**
   * Impede a recuperação de histórico conversacional caso haja divergência
   * entre a identidade ativa e o contexto de quem gerou a conversa.
   */
  static authorize(identity: ExecutiveIdentityContext, conversation: ExecutiveConversationContext): void {
    if (
      conversation.tenantId !== identity.tenantId ||
      conversation.userId !== identity.userId ||
      conversation.organizationId !== identity.organizationId
    ) {
      throw new ExecutiveConversationIsolationViolationError(); // Governed message inside
    }
  }
}
