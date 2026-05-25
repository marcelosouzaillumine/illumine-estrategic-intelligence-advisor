export type IOSAuditEvent = 
  | 'IOS_STATE_UPDATED'
  | 'INSTITUTIONAL_PULSE_RECALCULATED'
  | 'CROSS_DOMAIN_SYNCHRONIZATION_EXECUTED'
  | 'INSTITUTIONAL_CONTEXT_UPDATED'
  | 'DEPENDENCY_GRAPH_UPDATED'
  | 'OPERATIONAL_STATE_PROJECTED'
  | 'UNIFIED_TIMELINE_REFRESHED';

export interface IOSAuditRecord {
  auditId: string;
  tenantId: string;
  eventType: IOSAuditEvent;
  details: string;
  timestamp: string;
}

export class IOSAuditLogger {
  private static logs: IOSAuditRecord[] = [];

  static logEvent(
    tenantId: string,
    eventType: IOSAuditEvent,
    details: string
  ): void {
    const record: IOSAuditRecord = {
      auditId: 'IOS-AUDIT-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      tenantId,
      eventType,
      details,
      timestamp: new Date().toISOString()
    };

    this.logs.push(record);
    console.log('[IOS Audit] [' + tenantId + '] ' + eventType + ': ' + details);
  }

  static getLogs(tenantId: string): IOSAuditRecord[] {
    return this.logs.filter(l => l.tenantId === tenantId).reverse();
  }

  static clear(tenantId: string): void {
    this.logs = this.logs.filter(l => l.tenantId !== tenantId);
  }
}
