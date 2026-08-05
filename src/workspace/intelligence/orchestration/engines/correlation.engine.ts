import { EnterpriseInsight, CausalHypothesis } from '../../models/enterprise-insight.types';
import { EnterpriseGraph } from '../../core/graph/EnterpriseGraph';
import { RelationshipResolver } from '../resolvers/relationship.resolver';

export class CorrelationEngine {
  constructor(private resolver: RelationshipResolver) {}

  /**
   * Identifies potential causal hypotheses between a list of disparate insights.
   */
  correlateInsights(insights: EnterpriseInsight[], graph: EnterpriseGraph): CausalHypothesis[] {
    const hypotheses: CausalHypothesis[] = [];
    
    // Simplistic O(n^2) check for demonstration. Real engine would use graph embeddings or LLM.
    for (let i = 0; i < insights.length; i++) {
      for (let j = i + 1; j < insights.length; j++) {
        const insightA = insights[i];
        const insightB = insights[j];

        // Check if there's a causal link in the graph between the offices or metrics
        const linked = this.resolver.findCausalLink(insightA.sourceOffice, insightB.sourceOffice, 3);
        if (linked) {
          hypotheses.push({
            id: `hyp-${insightA.id}-${insightB.id}`,
            description: `Potential correlation between ${insightA.sourceOffice} issue and ${insightB.sourceOffice} performance.`,
            sourceNodeId: insightA.id,
            targetNodeId: insightB.id,
            confidenceScore: 0.82
          });
        }
      }
    }

    return hypotheses;
  }
}
