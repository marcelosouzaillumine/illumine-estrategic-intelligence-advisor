import { KnowledgeIngestionRequest } from '@/core/knowledge/ingestion/KnowledgeIngestionRequest';

export class ConversationKnowledgeAdapter {
  // Translates an ExecutiveConversation object into a standardized Ingestion Request
  adapt(conversationPayload: any, tenantId: string, advisorId: string): KnowledgeIngestionRequest {
    return {
      tenantId,
      source: "conversation",
      payload: conversationPayload,
      metadata: {
        createdBy: advisorId,
        createdAt: new Date(),
        classification: "internal" // Derived from Conversation context
      }
    };
  }
}
