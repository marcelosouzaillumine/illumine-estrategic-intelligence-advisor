import { EnterpriseGraph } from '../../core/graph/EnterpriseGraph';
import { GraphTraversal } from '../../core/graph/GraphTraversal';
import { BusinessImpact } from '../../models/enterprise-insight.types';

export interface ImpactNode {
  nodeId: string;
  nodeLabel: string;
  office: string;
  impactType: 'DIRECT' | 'INDIRECT';
  accumulatedWeight: number;
}

export interface ImpactChain {
  sourceEventId: string;
  nodes: ImpactNode[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  overallSeverity: BusinessImpact['severity'];
}

export class ImpactPropagationEngine {
  constructor(private traversal: GraphTraversal) {}

  /**
   * Calculates a detailed Impact Chain showing direct, indirect, and accumulated impact.
   */
  calculateImpactChain(sourceNodeId: string, graph: EnterpriseGraph): ImpactChain {
    const connected = this.traversal.findConnectedNodes(sourceNodeId, 5);
    
    const nodes: ImpactNode[] = [];
    let accumulatedWeight = 0;

    connected.forEach(c => {
      const isOffice = c.node.type === 'OFFICE';
      if (!isOffice) {
        const weight = c.path.reduce((acc, edge) => acc * edge.weight, 1.0);
        accumulatedWeight += weight;

        nodes.push({
          nodeId: c.node.id,
          nodeLabel: c.node.label,
          office: c.node.metadata?.office || 'unknown',
          impactType: c.depth === 1 ? 'DIRECT' : 'INDIRECT',
          accumulatedWeight: weight
        });
      }
    });

    let overallSeverity: BusinessImpact['severity'] = 'low';
    if (accumulatedWeight > 3.0) overallSeverity = 'critical';
    else if (accumulatedWeight > 1.5) overallSeverity = 'high';
    else if (accumulatedWeight > 0.5) overallSeverity = 'medium';

    let urgency: 'low' | 'medium' | 'high' | 'critical' = 'medium';
    if (nodes.some(n => n.impactType === 'DIRECT' && n.accumulatedWeight > 0.8)) {
      urgency = 'critical'; // Direct high-weight impacts require immediate action
    } else if (overallSeverity === 'critical') {
      urgency = 'high';
    }

    return {
      sourceEventId: sourceNodeId,
      nodes,
      urgency,
      overallSeverity
    };
  }
}
