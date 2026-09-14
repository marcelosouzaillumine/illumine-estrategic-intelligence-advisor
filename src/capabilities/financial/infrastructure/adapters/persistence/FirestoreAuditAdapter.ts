import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';
import { AuditLogPayload } from '../../../../../services/platform/auditService';
import { blockedFirestoreWrite } from '../../../../../lib/blockedFirestoreWrite';

export class FirestoreAuditAdapter {
  static async logAction(payload: AuditLogPayload): Promise<void> {
    blockedFirestoreWrite(); // addDoc(collection(db, 'audit_logs'), {
      // ...payload,
      // createdAt: serverTimestamp(),
    // });
  }
}
