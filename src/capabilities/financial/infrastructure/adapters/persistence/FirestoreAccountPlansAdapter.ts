import { collection, query, where, orderBy, onSnapshot, writeBatch, doc, serverTimestamp, addDoc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';
import { FirestoreAuthAdapter } from '../../../../../adapters/persistence/FirestoreAuthAdapter';
import { IAccountPlansPersistence } from '../../../../../contracts/persistence/IAccountPlansPersistence';
import { blockedFirestoreWrite } from '../../../../../lib/blockedFirestoreWrite';

export class FirestoreAccountPlansAdapter implements IAccountPlansPersistence {
  listenToAccountPlanGeneric(clientId: string, planType: string | undefined, onUpdate: (accounts: any[]) => void, onError: (error: any) => void): () => void {
    let q;
    if (planType) {
      q = query(
        collection(db, 'account_plans'),
        where('clientId', '==', clientId),
        where('planType', '==', planType),
        orderBy('code', 'asc')
      );
    } else {
      q = query(
        collection(db, 'account_plans'),
        where('clientId', '==', clientId),
        orderBy('code', 'asc')
      );
    }
    
    return onSnapshot(q as any, (snapshot: any) => {
      onUpdate(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() as any })));
    }, onError);
  }

  listenToAccountPlans(clientId: string, planType: string, onUpdate: (accounts: any[]) => void, onLegacyMigration: (legacyDocs: any[]) => void): () => void {
    const q = query(
      collection(db, 'account_plans'),
      where('clientId', '==', clientId),
      where('planType', '==', planType),
      orderBy('code', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const allDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
      const legacyDocs = allDocs.filter(d => !d.planType);
      
      if (legacyDocs.length > 0) {
        onLegacyMigration(legacyDocs);
        return;
      }

      const filteredDocs = allDocs.filter(d => 
        d.planType === planType && 
        d.status !== 'pending' && 
        d.status !== 'rejected'
      );
      
      onUpdate(filteredDocs);
    }, (error) => {
      console.error("Error fetching accounts:", error);
      onUpdate([]);
    });
  }

  async migrateLegacyAccounts(legacyDocs: any[]): Promise<void> {
    const batch: any = blockedFirestoreWrite(); // writeBatch(db);
    legacyDocs.forEach(d => {
      batch.update(doc(db, 'account_plans', d.id), { planType: 'accounting' });
    });
    await batch.commit();
  }

  listenToAccountingAccounts(clientId: string, onUpdate: (accounts: any[]) => void): () => void {
    const q = query(
      collection(db, 'account_plans'),
      where('clientId', '==', clientId),
      where('planType', '==', 'accounting'),
      orderBy('code', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      onUpdate(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }

  async addAccountPlan(payload: any): Promise<void> {
    blockedFirestoreWrite(); // addDoc(collection(db, 'account_plans'), {
      // ...payload,
      // createdAt: serverTimestamp()
    // });
  }

  async updateAccountPlan(id: string, payload: any): Promise<void> {
    blockedFirestoreWrite(); // updateDoc(doc(db, 'account_plans', id), {
      // ...payload,
      // updatedAt: serverTimestamp()
    // });
  }

  async deleteAccountPlan(id: string): Promise<void> {
    blockedFirestoreWrite(); // deleteDoc(doc(db, 'account_plans', id));
  }

  async bulkAddDefaultPlans(defaultPlan: any[], clientId: string, clientName: string, planType: string): Promise<void> {
    const batch: any = blockedFirestoreWrite(); // writeBatch(db);
    defaultPlan.forEach(acc => {
      const docRef = doc(collection(db, 'account_plans'));
      batch.set(docRef, {
        ...acc,
        clientId,
        clientName,
        planType,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: FirestoreAuthAdapter.getCurrentUserId(),
        status: 'approved',
        requiresApproval: false,
        sourceCollection: 'account_plans'
      });
    });
    await batch.commit();
  }

  async clearAllItems(clientId: string, type: string): Promise<void> {
    const q = query(
      collection(db, 'account_plans'), 
      where('clientId', '==', clientId),
      where('planType', '==', type)
    );
    const snapshot = await getDocs(q);
    
    const chunkSize = 450;
    const docs = snapshot.docs;
    for (let i = 0; i < docs.length; i += chunkSize) {
      const batch: any = blockedFirestoreWrite(); // writeBatch(db);
      docs.slice(i, i + chunkSize).forEach(d => batch.delete(d.ref));
      await batch.commit();
    }
  }

  async saveAllNewAccounts(selectedClient: string, planType: string, unassignedAccounts: any[]): Promise<number> {
    let count = 0;
    const chunkSize = 450;
    for (let i = 0; i < unassignedAccounts.length; i += chunkSize) {
      const batch: any = blockedFirestoreWrite(); // writeBatch(db);
      const chunk = unassignedAccounts.slice(i, i + chunkSize);
      
      for (const acc of chunk) {
        const newDocRef = doc(collection(db, 'account_plans'));
        const { id, ...accData } = acc;
        batch.set(newDocRef, {
          ...accData,
          clientId: selectedClient,
          planType,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: FirestoreAuthAdapter.getCurrentUserId()
        });
        count++;
      }
      await batch.commit();
    }
    return count;
  }
}
