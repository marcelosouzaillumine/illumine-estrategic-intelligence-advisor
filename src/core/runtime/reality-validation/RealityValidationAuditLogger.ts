export type RealityValidationAuditEvent =
  | 'GOLDEN_DATASET_LOADED'
  | 'SCENARIO_VALIDATED'
  | 'STRESS_TRIGGERED'
  | 'INTERCOMPANY_RESOLVED'
  | 'WORKFLOW_VALIDATED'
  | 'SANDBOX_CLEARED';

export interface RealityValidationAuditRecord {
  auditId: string;
  tenantId: string;
  eventType: RealityValidationAuditEvent;
  details: string;
  timestamp: string;
}

export class RealityValidationAuditLogger {
  private static logs: RealityValidationAuditRecord[] = [];

  static logEvent(tenantId: string, eventType: RealityValidationAuditEvent, details: string): void {
    const record: RealityValidationAuditRecord = {
      auditId: 'RV-AUDIT-' + Date.now() + '-' + Math.floor(Math.random() * 9999),
      tenantId,
      eventType,
      details,
      timestamp: new Date().toISOString()
    };
    this.logs.push(record);
    console.log('[Reality Validation] [' + tenantId + '] ' + eventType + ': ' + details);
  }

  static getLogs(tenantId: string): RealityValidationAuditRecord[] {
    return this.logs.filter(l => l.tenantId === tenantId).reverse();
  }

  static clear(tenantId: string): void {
    this.logs = this.logs.filter(l => l.tenantId !== tenantId);
    this.logEvent(tenantId, 'SANDBOX_CLEARED', 'Reality Validation sandbox destruído. Tenant isolation preservado.');
  }
}
