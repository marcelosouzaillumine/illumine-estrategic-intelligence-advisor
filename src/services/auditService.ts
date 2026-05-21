import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

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
      await addDoc(collection(db, 'audit_logs'), {
        ...payload,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Failed to log audit action:', error);
    }
  }
};
