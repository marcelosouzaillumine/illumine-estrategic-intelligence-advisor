import { InstitutionalKnowledgeGraph } from './InstitutionalKnowledgeGraph';
import { RiskCorrelation } from './KnowledgeGraphTypes';
import { GraphAuditLogger } from './GraphAuditLogger';

export class RiskCorrelationEngine {
  static analyzeCorrelations(tenantId: string): RiskCorrelation[] {
    const nodes = InstitutionalKnowledgeGraph.getNodesByTenant(tenantId);
    const edges = InstitutionalKnowledgeGraph.getEdgesByTenant(tenantId);

    const correlations: RiskCorrelation[] = [];

    // Detectar correlação: ALERTS ligados a GOVERNANCE_VIOLATIONS recorrentes
    const alerts = nodes.filter(n => n.type === 'ALERT');
    const violations = nodes.filter(n => n.type === 'GOVERNANCE_VIOLATION');

    alerts.forEach(alert => {
      // Find paths Alert -> CAUSED -> Violation
      const causedEdges = edges.filter(e => e.sourceNodeId === alert.nodeId && e.type === 'CAUSED');
      
      causedEdges.forEach(edge => {
        const violationNode = violations.find(v => v.nodeId === edge.targetNodeId);
        if (violationNode) {
          correlations.push({
            correlationId: `CORR-\${Date.now()}-\${Math.floor(Math.random() * 100)}`,
            tenantId,
            sourceAlertId: alert.nodeId,
            correlatedViolationId: violationNode.nodeId,
            confidenceLevel: 'HIGH', // Simplification for MVP
            description: `Correlação forte: O Alerta "\${alert.label}" antecede sistematicamente a Violação "\${violationNode.label}".`
          });
        }
      });
    });

    GraphAuditLogger.logEvent(tenantId, 'CORRELATION_ANALYZED', `Encontradas \${correlations.length} correlações de risco.`);

    return correlations;
  }
}
