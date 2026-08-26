import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { blockedFirestoreWrite } from '../../lib/blockedFirestoreWrite';

export class FirestoreClientAssumptionsAdapter {
  static async getAssumptions(clientId: string): Promise<any> {
    const qAssumptions = query(
      collection(db, 'client_assumptions'),
      where('clientId', '==', clientId)
    );
    const snapAssumptions = await getDocs(qAssumptions);
    if (!snapAssumptions.empty) {
      return snapAssumptions.docs[0].data();
    }
    return null;
  }

  static async getAccountPlans(clientId: string): Promise<any[]> {
    const qAccounts = query(
      collection(db, 'account_plans'),
      where('clientId', '==', clientId),
      orderBy('code', 'asc')
    );
    const snapAccounts = await getDocs(qAccounts);
    return snapAccounts.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
  }

  static async saveAssumptions(clientId: string, currentAssumptions: any): Promise<void> {
    const q = query(
      collection(db, 'client_assumptions'),
      where('clientId', '==', clientId)
    );
    const snap = await getDocs(q);
    
    const payload = {
      ...currentAssumptions,
      clientId,
      updatedAt: serverTimestamp()
    };

    if (!snap.empty) {
      blockedFirestoreWrite(); // updateDoc(doc(db, 'client_assumptions', snap.docs[0].id), payload);
    } else {
      blockedFirestoreWrite(); // addDoc(collection(db, 'client_assumptions'), payload);
    }
  }
}
