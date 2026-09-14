import { GraphAuditRecord } from './KnowledgeGraphTypes';

export class GraphAuditLogger {
  private static logs: GraphAuditRecord[] = [];

  static logEvent(
    tenantId: string,
    eventType: GraphAuditRecord['eventType'],
    details: string
  ): void {
    const record: GraphAuditRecord = {
      auditId: `GRAPH-AUDIT-\${Date.now()}-\${Math.floor(Math.random() * 1000)}`,
      tenantId,
      eventType,
      details,
      timestamp: new Date().toISOString()
    };

    this.logs.push(record);
    console.log(`[Graph Audit] [\${tenantId}] \${eventType}: \${details}`);
  }

  static getLogs(tenantId: string): GraphAuditRecord[] {
    return this.logs.filter(l => l.tenantId === tenantId).reverse();
  }

  static clear(tenantId: string): void {
    this.logs = this.logs.filter(l => l.tenantId !== tenantId);
  }
}
