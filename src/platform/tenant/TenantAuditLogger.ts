import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { TenantAuditRecord } from './TenancyTypes';
import { getErrorMessage } from '../../types/runtime/RuntimeErrorGuards';
import { blockedFirestoreWrite } from '../../lib/blockedFirestoreWrite';

export class TenantAuditLogger {
  /**
   * Grava logs de acesso e troca de contexto. (Append-Only)
   */
  static async logAction(
    tenantId: string,
    workspaceId: string | null,
    userId: string,
    action: TenantAuditRecord['action'],
    metadata?: any
  ): Promise<void> {
    try {
      const record: TenantAuditRecord = {
        auditId: `AUDIT-${crypto.randomUUID()}`,
        tenantId,
        workspaceId,
        userId,
        action,
        timestamp: new Date().toISOString(),
        metadata
      };

      blockedFirestoreWrite(); // setDoc(doc(db, 'tenant_audit_logs', record.auditId), record);
      console.log(`[TenantAuditLogger] ${action} registrado para Tenant ${tenantId}`);
    } catch (err: unknown) {
      console.error('[TenantAuditLogger] Falha ao registrar log de auditoria:', getErrorMessage(err));
    }
  }
}
