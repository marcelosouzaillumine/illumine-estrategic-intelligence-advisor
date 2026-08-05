import { EnterpriseInsight, BusinessImpact } from '../../models/enterprise-insight.types';
import { GraphTraversal } from '../../core/graph/GraphTraversal';
import { EnterpriseGraph } from '../../core/graph/EnterpriseGraph';

export class ImpactPropagationEngine {
  constructor(private traversal: GraphTraversal) {}

  /**
   * Calculates the 'blast radius' of an event in the intelligence network.
   */
  calculateBlastRadius(sourceNodeId: string, graph: EnterpriseGraph): BusinessImpact {
    const connected = this.traversal.findConnectedNodes(sourceNodeId, 4);
    
    const affectedOffices = new Set<string>();
    connected.forEach(c => {
      if (c.node.type === 'OFFICE') {
        affectedOffices.add(c.node.id);
      }
    });

    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (affectedOffices.size > 3) severity = 'critical';
    else if (affectedOffices.size > 1) severity = 'high';
    else severity = 'medium';

    return {
      severity,
      description: `Impacto detectado em ${affectedOffices.size} domínios executivos.`,
      affectedMetrics: connected.filter(c => c.node.type === 'METRIC').map(c => c.node.id)
    };
  }

  enrichInsightImpact(insight: EnterpriseInsight, graph: EnterpriseGraph): EnterpriseInsight {
    const blastRadius = this.calculateBlastRadius(insight.id, graph);
    return {
      ...insight,
      businessImpact: blastRadius
    };
  }
}
