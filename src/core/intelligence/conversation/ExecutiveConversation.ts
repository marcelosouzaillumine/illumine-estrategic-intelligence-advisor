import { IntelligenceArtifact } from '../artifacts/IntelligenceArtifact';
import { ExecutiveDecisionArtifact } from '../decision/ExecutiveDecisionArtifact';

export interface ConversationMessage {
  id: string;
  authorId: string;
  authorRole: "executive" | "advisor" | "system";
  content: string;
  timestamp: Date;
}

export interface ExecutiveConversation {
  id: string;
  tenantId: string;
  workspaceId: string;
  status: "active" | "archived";
  startedAt: Date;
  endedAt?: Date;
  
  // Aggregate data
  messages: ConversationMessage[];
  signals: IntelligenceArtifact[];       // artifactType = "signal"
  insights: IntelligenceArtifact[];      // artifactType = "insight"
  recommendations: IntelligenceArtifact[]; // artifactType = "recommendation"
  decisions: ExecutiveDecisionArtifact[];
  
  ontologyVersion: "1.0";
}
