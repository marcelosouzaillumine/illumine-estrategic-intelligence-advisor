export type OrchestrationAuditEvent = 
  | 'ORCHESTRATION_STARTED'
  | 'PLAYBOOK_TRIGGERED'
  | 'RECOMMENDATION_GENERATED'
  | 'ESCALATION_COORDINATED'
  | 'RECOVERY_PATH_PROJECTED'
  | 'PRIORITY_SEQUENCE_CREATED'
  | 'CROSS_DOMAIN_RESPONSE_MAPPED';

export interface OrchestrationAuditRecord {
  auditId: string;
  tenantId: string;
  eventType: OrchestrationAuditEvent;
  details: string;
  timestamp: string;
}

export class OrchestrationAuditLogger {
  private static logs: OrchestrationAuditRecord[] = [];

  static logEvent(
    tenantId: string,
    eventType: OrchestrationAuditEvent,
    details: string
  ): void {
    const record: OrchestrationAuditRecord = {
      auditId: 'ORCH-AUDIT-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      tenantId,
      eventType,
      details,
      timestamp: new Date().toISOString()
    };

    this.logs.push(record);
    console.log('[Governance Orchestration Audit] [' + tenantId + '] ' + eventType + ': ' + details);
  }

  static getLogs(tenantId: string): OrchestrationAuditRecord[] {
    return this.logs.filter(l => l.tenantId === tenantId).reverse();
  }

  static clear(tenantId: string): void {
    this.logs = this.logs.filter(l => l.tenantId !== tenantId);
  }
}
