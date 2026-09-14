import { InstitutionalKnowledgeGraph } from './InstitutionalKnowledgeGraph';
import { SemanticLineageEngine } from './SemanticLineageEngine';

export class InstitutionalMemoryEngine {
  /**
   * Inicializa o Mock Dataset da Fase 17 (DEMO_GRAPH_FIXTURE)
   */
  static injectMockFixture(tenantId: string) {
    InstitutionalKnowledgeGraph.clearTenant(tenantId);

    const lineage = SemanticLineageEngine.generateLineageReference('DEMO_EXEC_001');

    // Nodes
    const alertNode = InstitutionalKnowledgeGraph.addNode(tenantId, 'ALERT', 'Liquidity Suffocation Alert');
    const riskNode = InstitutionalKnowledgeGraph.addNode(tenantId, 'SYSTEMIC_RISK', 'Operational Parasitism');
    const wfNode = InstitutionalKnowledgeGraph.addNode(tenantId, 'WORKFLOW', 'Board Response Workflow');
    const decisionNode = InstitutionalKnowledgeGraph.addNode(tenantId, 'DECISION', 'Capital Injection Approval');
    const violationNode = InstitutionalKnowledgeGraph.addNode(tenantId, 'GOVERNANCE_VIOLATION', 'Intercompany Loan Breach');

    // Edges
    if (riskNode && alertNode) {
      InstitutionalKnowledgeGraph.addEdge(tenantId, riskNode.nodeId, alertNode.nodeId, 'CAUSED', lineage);
    }
    
    if (alertNode && wfNode) {
      InstitutionalKnowledgeGraph.addEdge(tenantId, alertNode.nodeId, wfNode.nodeId, 'TRIGGERED', lineage);
    }
    
    if (wfNode && decisionNode) {
      InstitutionalKnowledgeGraph.addEdge(tenantId, wfNode.nodeId, decisionNode.nodeId, 'GENERATED', lineage);
    }
    
    if (violationNode && riskNode) {
      InstitutionalKnowledgeGraph.addEdge(tenantId, violationNode.nodeId, riskNode.nodeId, 'CAUSED', lineage);
    }
  }
}
