import { ImportAuditTrailLog } from './types';

export class ImportAuditTrail {
  static logs: ImportAuditTrailLog[] = [];

  static log(audit: ImportAuditTrailLog) {
    this.logs.push(audit);
    console.log(`[ImportAuditTrail] Registro salvo: Lote com ${audit.totalLines} linhas, status: ${audit.finalStatus}`);
  }
}
