export class OperationalPlaybookAuditLogger {
  static log(tenantId: string, event: string) {
    console.log('[Playbook Audit] [' + tenantId + '] ' + event);
  }
}
