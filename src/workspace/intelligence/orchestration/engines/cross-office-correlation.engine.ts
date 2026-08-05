import { EnterpriseInsight, CausalHypothesis } from '../../models/enterprise-insight.types';
import { EnterpriseGraph } from '../../core/graph/EnterpriseGraph';
import { RelationshipResolver } from '../resolvers/relationship.resolver';

export interface CrossOfficeCorrelation {
  sourceOffice: string;
  targetOffice: string;
  correlationScore: number;
  relationshipType: 'DIRECT' | 'INDIRECT' | 'SYSTEMIC';
  evidenceIds: string[];
}

export class CrossOfficeCorrelationEngine {
  constructor(private resolver: RelationshipResolver) {}

  /**
   * Identifies and classifies cross-office correlations.
   * Moving from just "is there a link" to "what is the nature of this link across offices".
   */
  classifyCorrelations(insights: EnterpriseInsight[], graph: EnterpriseGraph): CrossOfficeCorrelation[] {
    const correlations: CrossOfficeCorrelation[] = [];
    
    for (let i = 0; i < insights.length; i++) {
      for (let j = i + 1; j < insights.length; j++) {
        const insightA = insights[i];
        const insightB = insights[j];

        if (insightA.sourceOffice === insightB.sourceOffice) {
          continue; // Focus on cross-office
        }

        const connections = this.resolver['traversal'].findConnectedNodes(insightA.id, 4);
        
        let foundPath = connections.find(c => c.node.id === insightB.id);
        
        if (foundPath) {
          let relationshipType: 'DIRECT' | 'INDIRECT' | 'SYSTEMIC' = 'SYSTEMIC';
          if (foundPath.depth === 1) relationshipType = 'DIRECT';
          else if (foundPath.depth === 2) relationshipType = 'INDIRECT';

          const pathIds = foundPath.path.map(p => p.id);
          const score = this.resolver.calculatePathConfidence(pathIds);

          correlations.push({
            sourceOffice: insightA.sourceOffice,
            targetOffice: insightB.sourceOffice,
            correlationScore: score,
            relationshipType,
            evidenceIds: [insightA.id, insightB.id] // using insight ids as evidence representation
          });
        }
      }
    }

    return correlations;
  }
}
