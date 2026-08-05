import { GroundingContextProvider } from './GroundingContextProvider';
import { KnowledgeRetrievalEngine } from '../../retrieval/KnowledgeRetrievalEngine';

export class KnowledgeProvider implements GroundingContextProvider {
  providerName = "knowledge_fabric";

  constructor(private retrievalEngine: KnowledgeRetrievalEngine) {}

  async provideContext(query: string, tenantId: string, constraints?: any): Promise<any> {
    // Queries the Enterprise Knowledge Graph
    const candidates = await this.retrievalEngine.retrieve(query, tenantId);
    return {
      artifacts: candidates
    };
  }
}
