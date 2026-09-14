export type UXAuditEvent = 
  | 'UX_EVALUATION_STARTED'
  | 'JOURNEY_MAPPED'
  | 'FRICTION_ANALYZED';

export class UXValidationAuditLogger {
  private static logs: any[] = [];

  static logEvent(tenantId: string, eventType: UXAuditEvent, details: string) {
    const record = { tenantId, eventType, details, timestamp: new Date().toISOString() };
    this.logs.push(record);
    console.log('[UX Audit] [' + tenantId + '] ' + eventType + ': ' + details);
  }
}
