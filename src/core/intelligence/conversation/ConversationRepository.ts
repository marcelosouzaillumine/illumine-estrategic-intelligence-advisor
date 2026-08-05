import { ExecutiveConversation } from './ExecutiveConversation';

export interface ConversationRepository {
  findById(tenantId: string, conversationId: string): Promise<ExecutiveConversation | null>;
  save(conversation: ExecutiveConversation): Promise<void>;
  findByTenant(tenantId: string): Promise<ExecutiveConversation[]>;
}
