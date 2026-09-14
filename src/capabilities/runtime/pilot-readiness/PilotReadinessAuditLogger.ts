export class PilotReadinessAuditLogger {
  static log(tenantId: string, event: string) {
    console.log('[Pilot Audit] [' + tenantId + '] ' + event);
  }
}
