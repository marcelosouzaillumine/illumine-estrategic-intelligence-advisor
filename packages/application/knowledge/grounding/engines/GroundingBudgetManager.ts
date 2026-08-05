import { KnowledgeArtifact } from '@/core/knowledge/models/KnowledgeArtifact';

export class GroundingBudgetManager {
  // Enforces max documents/tokens
  enforceBudget(rankedCandidates: KnowledgeArtifact[], tokenBudget: number): KnowledgeArtifact[] {
    // Mock: just take top 10
    return rankedCandidates.slice(0, 10);
  }
}
