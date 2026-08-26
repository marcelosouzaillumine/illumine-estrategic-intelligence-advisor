import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { FirestoreAuthAdapter } from './FirestoreAuthAdapter';

export class FirestoreSystemAssumptionsAdapter {
  static listenToEconomicPremises(onUpdate: (data: any) => void): () => void {
    return onSnapshot(doc(db, 'system', 'economic_premises'), (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data());
      }
    });
  }

  static async updateEconomicPremises(updatedData: any, formattedDate: string, formattedMonthYear: string): Promise<void> {
    (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // setDoc(doc(db, 'system', 'economic_premises'), {
      econData: updatedData,
      lastSync: formattedDate,
      lastSyncFull: formattedMonthYear,
      updatedAt: serverTimestamp(),
      updatedBy: FirestoreAuthAdapter.getCurrentUserEmail()
    });
  }
}
