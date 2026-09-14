import { FirestoreAuditAdapter } from '../../adapters/persistence/FirestoreAuditAdapter';

export interface AuditLogPayload {
  documentId: string;
  clientId: string;
  userId: string;
  userEmail: string;
  action: 'curation_approved' | 'curation_rejected' | 'value_edited' | 'account_mapped';
  details: any;
}

export const auditService = {
  logAction: async (payload: AuditLogPayload) => {
    try {
      await FirestoreAuditAdapter.logAction(payload);
    } catch (error) {
      console.error('Failed to log audit action:', error);
    }
  }
};
