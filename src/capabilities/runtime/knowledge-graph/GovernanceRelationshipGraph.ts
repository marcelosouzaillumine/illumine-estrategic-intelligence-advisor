import { InstitutionalKnowledgeGraph } from './InstitutionalKnowledgeGraph';
import { SemanticLineageEngine } from './SemanticLineageEngine';

export class GovernanceRelationshipGraph {
  static mapApproval(tenantId: string, workflowId: string, approverId: string, decisionId: string) {
    const lineage = SemanticLineageEngine.generateLineageReference(Date.now().toString(), workflowId);

    // Na arquitetura real as IDs podem vir de fora, aqui criamos nós para demonstrar
    const workflowNode = InstitutionalKnowledgeGraph.addNode(tenantId, 'WORKFLOW', `Workflow: \${workflowId}`);
    const userNode = InstitutionalKnowledgeGraph.addNode(tenantId, 'USER', `Approver: \${approverId}`);
    const decisionNode = InstitutionalKnowledgeGraph.addNode(tenantId, 'DECISION', `Decision: \${decisionId}`);

    if (workflowNode && decisionNode) {
      InstitutionalKnowledgeGraph.addEdge(tenantId, workflowNode.nodeId, decisionNode.nodeId, 'GENERATED', lineage);
    }
    
    if (userNode && decisionNode) {
      InstitutionalKnowledgeGraph.addEdge(tenantId, userNode.nodeId, decisionNode.nodeId, 'APPROVED_BY', lineage);
    }
  }

  static mapEscalation(tenantId: string, sourceAlertId: string, targetWorkflowId: string) {
    const lineage = SemanticLineageEngine.generateLineageReference(Date.now().toString(), targetWorkflowId);

    const alertNode = InstitutionalKnowledgeGraph.addNode(tenantId, 'ALERT', `Alert: \${sourceAlertId}`);
    const workflowNode = InstitutionalKnowledgeGraph.addNode(tenantId, 'WORKFLOW', `Workflow: \${targetWorkflowId}`);

    if (alertNode && workflowNode) {
      InstitutionalKnowledgeGraph.addEdge(tenantId, alertNode.nodeId, workflowNode.nodeId, 'TRIGGERED', lineage);
      InstitutionalKnowledgeGraph.addEdge(tenantId, workflowNode.nodeId, alertNode.nodeId, 'RELATED_TO', lineage);
    }
  }
}
