import { AIUsageAuditRecord } from './AIGovernanceTypes';

export class AIUsageAuditLogger {
  private static logs: AIUsageAuditRecord[] = [];

  static logEvent(event: AIUsageAuditRecord['event'], aiTraceId: string, tenantId: string, metadata?: any) {
    const record: AIUsageAuditRecord = {
      auditId: `AIAUDIT-${Date.now()}`,
      aiTraceId,
      event,
      tenantId,
      timestamp: new Date().toISOString(),
      metadata
    };
    
    this.logs.push(record);
    console.log(`[AIUsageAuditLogger] ${event} - Trace: ${aiTraceId} - Tenant: ${tenantId}`);
  }

  static getLogs() {
    return [...this.logs];
  }
}
