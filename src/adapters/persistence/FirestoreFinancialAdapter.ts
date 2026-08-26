import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export const FirestoreFinancialAdapter = {
  async getEntriesByClientAndYear(clientId: string, year: number, type?: string, typeIn?: string[]) {
    let q = query(
      collection(db, 'financial_entries'),
      where('clientId', '==', clientId),
      where('year', '==', year)
    );
    if (type) {
      q = query(q, where('type', '==', type));
    }
    if (typeIn && typeIn.length > 0) {
      q = query(q, where('type', 'in', typeIn));
    }
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  async deleteEntriesByClientAndYear(clientId: string, year: number, type?: string, typeIn?: string[]) {
    let q = query(
      collection(db, 'financial_entries'),
      where('clientId', '==', clientId),
      where('year', '==', year)
    );
    if (type) {
      q = query(q, where('type', '==', type));
    }
    if (typeIn && typeIn.length > 0) {
      q = query(q, where('type', 'in', typeIn));
    }
    const snap = await getDocs(q);
    await Promise.all(snap.docs.map((d) => (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // deleteDoc(doc(db, 'financial_entries', d.id))));
  },

  async getAllEntriesByClient(clientId: string) {
    const q = query(
      collection(db, 'financial_entries'),
      where('clientId', '==', clientId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
};
