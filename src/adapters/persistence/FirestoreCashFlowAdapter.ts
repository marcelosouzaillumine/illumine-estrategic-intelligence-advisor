import { collection, query, where, getDocs, doc, setDoc, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { FirestoreAuthAdapter } from './FirestoreAuthAdapter';
import { ICashFlowPersistence, OperationalData } from '../../contracts/persistence/ICashFlowPersistence';

export class FirestoreCashFlowAdapter implements ICashFlowPersistence {
  async getOperationalData(clientId: string): Promise<OperationalData> {
    const payablesQuery = query(collection(db, 'payables'), where('clientId', '==', clientId));
    const receivablesQuery = query(collection(db, 'receivables'), where('clientId', '==', clientId));
    const positionsQuery = query(collection(db, 'financial_positions'), where('clientId', '==', clientId));

    const [payablesSnap, receivablesSnap, positionsSnap] = await Promise.all([
      getDocs(payablesQuery),
      getDocs(receivablesQuery),
      getDocs(positionsQuery)
    ]);
    
    return {
      payables: payablesSnap.docs.map(d => ({ id: d.id, ...d.data() })),
      receivables: receivablesSnap.docs.map(d => ({ id: d.id, ...d.data() })),
      positions: positionsSnap.docs.map(d => ({ id: d.id, ...d.data() }))
    };
  }

  async saveCashFlow(cleanId: string, ownerId: string | undefined, cashFlowData: any): Promise<void> {
    const q = query(
      collection(db, 'cash_flows'), 
      where('clientId', '==', cleanId),
      where('ownerId', '==', ownerId)
    );
    const existingSnap = await getDocs(q);
    
    if (!existingSnap.empty) {
      (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // setDoc(doc(db, 'cash_flows', existingSnap.docs[0].id), cashFlowData);
    } else {
      (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // addDoc(collection(db, 'cash_flows'), cashFlowData);
    }
  }

  async getFinancialEntries(cleanId: string): Promise<any[]> {
    const q = query(
      collection(db, 'financial_entries'),
      where('clientId', '==', cleanId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  async getBudgets(cleanId: string): Promise<any[]> {
    const q = query(
      collection(db, 'budgets'),
      where('clientId', '==', cleanId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  async getCashFlowsByClient(clientId: string, ownerId?: string): Promise<any[]> {
    if (!clientId) return [];
    const userId = ownerId || FirestoreAuthAdapter.getCurrentUserId();
    const q = query(
      collection(db, 'cash_flows'),
      where('clientId', '==', clientId),
      where('ownerId', '==', userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data());
  }

  async getAllCashFlowsByClient(clientId: string): Promise<any[]> {
    if (!clientId) return [];
    const q = query(
      collection(db, 'cash_flows'),
      where('clientId', '==', clientId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data());
  }
}
