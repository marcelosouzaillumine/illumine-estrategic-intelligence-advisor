export class ScaleReadinessAuditLogger {
  static log(tenantId: string, event: string): void {
    console.log('[Scale Readiness Audit] [' + tenantId + '] ' + event);
  }
}
