import { RetrievalStrategy } from './RetrievalStrategy';
import { KnowledgeRetrievalPort } from '@/core/knowledge/ports/KnowledgeRetrievalPort';
import { KnowledgeArtifact } from '@/core/knowledge/models/KnowledgeArtifact';

export class KnowledgeRetrievalEngine {
  constructor(private retrievalPort: KnowledgeRetrievalPort) {}

  async retrieve(query: string, tenantId: string, strategy?: RetrievalStrategy): Promise<KnowledgeArtifact[]> {
    // Uses the RetrievalPort to fetch the candidate set from the Knowledge Fabric
    // Strategy dictates filtering and weighting.
    const context = { tenantId, userRole: "System" };
    return this.retrievalPort.search(query, context);
  }
}
