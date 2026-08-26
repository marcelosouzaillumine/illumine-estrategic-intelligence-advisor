import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { AuditLogPayload } from '../../services/platform/auditService';

export class FirestoreAuditAdapter {
  static async logAction(payload: AuditLogPayload): Promise<void> {
    (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // addDoc(collection(db, 'audit_logs'), {
      ...payload,
      createdAt: serverTimestamp(),
    });
  }
}
