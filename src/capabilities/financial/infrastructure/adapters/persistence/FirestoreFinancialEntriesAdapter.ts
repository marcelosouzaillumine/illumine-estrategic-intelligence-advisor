import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';
import { IFinancialEntriesPersistence } from '../../../../../contracts/persistence/IFinancialEntriesPersistence';

export class FirestoreFinancialEntriesAdapter implements IFinancialEntriesPersistence {
  async getEntriesByTypesAndYear(clientId: string, queryTypes: string[], year: number): Promise<{ docs: any[] }> {
    const q = query(
      collection(db, 'financial_entries'),
      where('clientId', '==', clientId),
      where('type', 'in', queryTypes),
      where('year', '==', year)
    );
    const snap = await getDocs(q);
    return { docs: snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) };
  }

  async getAllEntriesForClient(clientId: string): Promise<{ docs: any[] }> {
    const q = query(
      collection(db, 'financial_entries'),
      where('clientId', '==', clientId)
    );
    const snap = await getDocs(q);
    return { docs: snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) };
  }

  async getEntriesByYear(clientId: string, year: number): Promise<{ docs: any[] }> {
    const q = query(
      collection(db, 'financial_entries'),
      where('clientId', '==', clientId),
      where('year', '==', year)
    );
    const snap = await getDocs(q);
    return { docs: snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) };
  }

  async getEntriesInYears(clientId: string, targetYears: number[]): Promise<{ docs: any[] }> {
    const q = query(
      collection(db, 'financial_entries'),
      where('clientId', '==', clientId),
      where('year', 'in', targetYears)
    );
    const snap = await getDocs(q);
    return { docs: snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) };
  }
}
