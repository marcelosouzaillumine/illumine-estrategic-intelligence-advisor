import { EnterpriseGraph } from '../core/graph/EnterpriseGraph';
import { GraphTraversal } from '../core/graph/GraphTraversal';
import { ExecutiveOffice } from '../models/enterprise-insight.types';

export interface ScenarioImpact {
  office: ExecutiveOffice | string;
  impacts: string[];
}

export interface ScenarioSimulationResult {
  question: string;
  triggerEvent: string;
  affectedOffices: ScenarioImpact[];
  confidence: number;
}

export class ScenarioEngine {
  constructor(private traversal: GraphTraversal) {}

  /**
   * Simulates a "What-If" scenario across the intelligence network.
   */
  simulateScenario(triggerNodeId: string, question: string, graph: EnterpriseGraph): ScenarioSimulationResult {
    // Traverse the graph to find blast radius of the trigger event
    const connected = this.traversal.findConnectedNodes(triggerNodeId, 5);
    
    // Group impacts by office
    const impactsByOffice = new Map<string, string[]>();

    connected.forEach(c => {
      const office = c.node.metadata?.office;
      if (office) {
        if (!impactsByOffice.has(office)) {
          impactsByOffice.set(office, []);
        }
        // Simplified mapping for demonstration. Real AI would generate descriptive impacts.
        impactsByOffice.get(office)!.push(`Impacto projetado em: ${c.node.label}`);
      }
    });

    const affectedOffices: ScenarioImpact[] = [];
    impactsByOffice.forEach((impacts, office) => {
      affectedOffices.push({ office, impacts });
    });

    return {
      question,
      triggerEvent: graph.getNode(triggerNodeId)?.label || triggerNodeId,
      affectedOffices,
      confidence: 0.82 // Example calculated confidence
    };
  }
}
