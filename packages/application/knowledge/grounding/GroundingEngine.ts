import { GroundingPackage } from '@/core/knowledge/grounding/GroundingPackage';
import { GroundingContextProvider } from './providers/GroundingContextProvider';
import { ContextFilteringEngine } from './engines/ContextFilteringEngine';
import { ContextRankingEngine } from './engines/ContextRankingEngine';
import { GroundingBudgetManager } from './engines/GroundingBudgetManager';
import { v4 as uuidv4 } from 'uuid';

export class GroundingEngine {
  constructor(
    private providers: GroundingContextProvider[],
    private filterEngine: ContextFilteringEngine,
    private rankingEngine: ContextRankingEngine,
    private budgetManager: GroundingBudgetManager
  ) {}

  async buildGroundingPackage(query: string, tenantId: string, securityCtx: any): Promise<GroundingPackage> {
    const traceId = uuidv4();
    let candidateArtifacts: any[] = [];
    
    // 1. Gather context from all capabilities (Knowledge, Financial, Risk, etc.)
    for (const provider of this.providers) {
      const result = await provider.provideContext(query, tenantId);
      if (result.artifacts) {
        candidateArtifacts.push(...result.artifacts);
      }
    }

    // 2. Filtering
    const filtered = this.filterEngine.filter(candidateArtifacts, securityCtx);

    // 3. Ranking
    const ranked = this.rankingEngine.rank(filtered);

    // 4. Budgeting
    const groundedArtifacts = this.budgetManager.enforceBudget(ranked, 8000);

    return {
      tenantId,
      conversationId: "conv-1",
      objective: query,
      executiveContext: {},
      knowledgeContext: groundedArtifacts,
      businessContext: {},
      conversationContext: {},
      evidence: [],
      restrictions: ["NO_AUTONOMOUS_DECISION"],
      policiesApplied: ["GroundingPolicyV1", "KnowledgeAccessPolicy"],
      budget: { maxTokens: 8000, usedTokens: 4500 },
      traceId,
      metadata: { generatedAt: new Date(), modelVersion: "v1" }
    };
  }
}
