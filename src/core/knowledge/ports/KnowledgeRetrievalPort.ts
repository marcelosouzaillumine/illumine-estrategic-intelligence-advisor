import { KnowledgeArtifact } from '../models/KnowledgeArtifact';

export interface KnowledgeContext {
  tenantId: string;
  userRole: string;
  domain?: string;
}

export interface KnowledgeRetrievalPort {
  search(query: string, context: KnowledgeContext): Promise<KnowledgeArtifact[]>;
}
