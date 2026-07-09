import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { AuditLogPayload } from '../../services/platform/auditService';

export class FirestoreAuditAdapter {
  static async logAction(payload: AuditLogPayload): Promise<void> {
    await addDoc(collection(db, 'audit_logs'), {
      ...payload,
      createdAt: serverTimestamp(),
    });
  }
}
