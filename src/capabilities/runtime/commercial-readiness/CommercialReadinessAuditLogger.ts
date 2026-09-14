export class CommercialReadinessAuditLogger {
  static log(tenantId: string, event: string) {
    console.log('[Commercial Audit] [' + tenantId + '] ' + event);
  }
}
