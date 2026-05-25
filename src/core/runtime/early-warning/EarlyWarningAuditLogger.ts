export type EarlyWarningAuditEvent = 
  | 'EARLY_WARNING_CREATED'
  | 'RISK_SIGNAL_DETECTED'
  | 'DETERIORATION_PATTERN_FOUND'
  | 'BENCHMARK_DEVIATION_DETECTED'
  | 'WARNING_ESCALATED'
  | 'PREDICTIVE_EXECUTION_COMPLETED'
  | 'BLOCKED_DETECTION';

export interface EarlyWarningAuditRecord {
  auditId: string;
  tenantId: string;
  eventType: EarlyWarningAuditEvent;
  details: string;
  timestamp: string;
}

export class EarlyWarningAuditLogger {
  private static logs: EarlyWarningAuditRecord[] = [];

  static logEvent(
    tenantId: string,
    eventType: EarlyWarningAuditEvent,
    details: string
  ): void {
    const record: EarlyWarningAuditRecord = {
      auditId: 'EW-AUDIT-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      tenantId,
      eventType,
      details,
      timestamp: new Date().toISOString()
    };

    this.logs.push(record);
    console.log('[Early Warning Audit] [' + tenantId + '] ' + eventType + ': ' + details);
  }

  static getLogs(tenantId: string): EarlyWarningAuditRecord[] {
    return this.logs.filter(l => l.tenantId === tenantId).reverse();
  }

  static clear(tenantId: string): void {
    this.logs = this.logs.filter(l => l.tenantId !== tenantId);
  }
}
