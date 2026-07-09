import { collection, query, where, getDocs, doc, setDoc, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { FirestoreAuthAdapter } from './FirestoreAuthAdapter';

export class FirestoreCashFlowAdapter {
  static async getOperationalData(clientId: string): Promise<{ payablesSnap: any, receivablesSnap: any, positionsSnap: any }> {
    const payablesQuery = query(collection(db, 'payables'), where('clientId', '==', clientId));
    const receivablesQuery = query(collection(db, 'receivables'), where('clientId', '==', clientId));
    const positionsQuery = query(collection(db, 'financial_positions'), where('clientId', '==', clientId));

    const [payablesSnap, receivablesSnap, positionsSnap] = await Promise.all([
      getDocs(payablesQuery),
      getDocs(receivablesQuery),
      getDocs(positionsQuery)
    ]);
    return { payablesSnap, receivablesSnap, positionsSnap };
  }

  static async saveCashFlow(cleanId: string, ownerId: string | undefined, cashFlowData: any): Promise<void> {
    const q = query(
      collection(db, 'cash_flows'), 
      where('clientId', '==', cleanId),
      where('ownerId', '==', ownerId)
    );
    const existingSnap = await getDocs(q);
    
    if (!existingSnap.empty) {
      await setDoc(doc(db, 'cash_flows', existingSnap.docs[0].id), cashFlowData);
    } else {
      await addDoc(collection(db, 'cash_flows'), cashFlowData);
    }
  }

  static async getFinancialEntries(cleanId: string): Promise<any> {
    const q = query(
      collection(db, 'financial_entries'),
      where('clientId', '==', cleanId)
    );
    return await getDocs(q);
  }

  static async getBudgets(cleanId: string): Promise<any> {
    const q = query(
      collection(db, 'budgets'),
      where('clientId', '==', cleanId)
    );
    return await getDocs(q);
  }

  static async getCashFlowsByClient(clientId: string): Promise<any[]> {
    if (!clientId) return [];
    const userId = FirestoreAuthAdapter.getCurrentUserId();
    const q = query(
      collection(db, 'cash_flows'),
      where('clientId', '==', clientId),
      where('ownerId', '==', userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data());
  }

  static async getAllCashFlowsByClient(clientId: string): Promise<any[]> {
    if (!clientId) return [];
    const q = query(
      collection(db, 'cash_flows'),
      where('clientId', '==', clientId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data());
  }
}
