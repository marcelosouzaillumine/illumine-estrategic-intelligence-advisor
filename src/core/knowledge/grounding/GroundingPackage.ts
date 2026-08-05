import { KnowledgeArtifact } from '../models/KnowledgeArtifact';

export interface GroundingPackage {
  tenantId: string;
  conversationId: string;
  objective: string;
  executiveContext: any; // e.g. Executive Profile, priorities
  knowledgeContext: KnowledgeArtifact[]; // The actual documents/decisions retrieved
  businessContext: any; // Company specific facts, sector
  conversationContext: any; // Recent messages leading to this
  financialContext?: any; // Financial Snapshot
  governanceContext?: any; // Governance Snapshot
  evidence: any[]; 
  restrictions: string[]; // Explicit rules for AI
  policiesApplied: string[];
  budget: {
    maxTokens: number;
    usedTokens: number;
  };
  traceId: string;
  metadata: {
    generatedAt: Date;
    modelVersion: string;
  };
}
