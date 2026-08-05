import { KnowledgeRetrievalService } from '../registry/KnowledgeRetrievalService';
import { KnowledgeContext } from './KnowledgeContext';
import { ExecutiveKnowledge } from '../contracts/ExecutiveKnowledge';

export class KnowledgeContextBuilder {
  constructor(private retrievalService: KnowledgeRetrievalService) {}

  /**
   * Builds the KnowledgeContext ensuring separation of concerns:
   * The builder groups and formats the knowledge, while retrieval just fetches it.
   */
  buildForConcept(ontologyConceptId: string): KnowledgeContext {
    const knowledgeItems = this.retrievalService.retrieveForConcept(ontologyConceptId);

    const patterns: ExecutiveKnowledge[] = [];
    const benchmarks: ExecutiveKnowledge[] = [];
    const rules: ExecutiveKnowledge[] = [];
    const references: ExecutiveKnowledge[] = [];
    
    let totalConfidence = 0;

    for (const item of knowledgeItems) {
      if (item.type === 'PATTERN') patterns.push(item);
      else if (item.type === 'BENCHMARK') benchmarks.push(item);
      else if (item.type === 'RULE') rules.push(item);
      else references.push(item);

      totalConfidence += item.confidence;
    }

    const avgConfidence = knowledgeItems.length > 0 ? totalConfidence / knowledgeItems.length : 1.0;

    return {
      ontologyConcepts: [ontologyConceptId],
      references,
      patterns,
      benchmarks,
      rules,
      confidence: avgConfidence
    };
  }
}
