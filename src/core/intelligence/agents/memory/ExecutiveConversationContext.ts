import { ExecutiveMemoryArtifact } from './contracts/ExecutiveMemoryArtifact';

export interface ExecutiveConversationContext {
  conversationId: string;
  tenantId: string;
  executiveRole: string;
  topic: string;
  startedAt: string;
  lastInteraction: string;
  activeInsights: ExecutiveMemoryArtifact[];
  pendingQuestions: ExecutiveMemoryArtifact[];
  referencedDecisions: ExecutiveMemoryArtifact[];
}

export class ConversationContextManager {
  public createSession(conversationId: string, tenantId: string, executiveRole: string, topic: string): ExecutiveConversationContext {
    return {
      conversationId,
      tenantId,
      executiveRole,
      topic,
      startedAt: new Date().toISOString(),
      lastInteraction: new Date().toISOString(),
      activeInsights: [],
      pendingQuestions: [],
      referencedDecisions: []
    };
  }

  public attachArtifact(session: ExecutiveConversationContext, artifact: ExecutiveMemoryArtifact): ExecutiveConversationContext {
    const updatedSession = { ...session, lastInteraction: new Date().toISOString() };

    switch(artifact.type) {
      case 'INSIGHT':
      case 'RISK':
      case 'OPPORTUNITY':
      case 'STRATEGIC_THEME':
        updatedSession.activeInsights.push(artifact);
        break;
      case 'QUESTION':
        updatedSession.pendingQuestions.push(artifact);
        break;
      case 'DECISION_CONTEXT':
        updatedSession.referencedDecisions.push(artifact);
        break;
    }

    return updatedSession;
  }
}
