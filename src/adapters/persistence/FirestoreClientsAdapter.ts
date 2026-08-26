import { collection, query, where, getDocs, getDoc, doc, setDoc, deleteDoc, orderBy, onSnapshot, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export const FirestoreClientsAdapter = {
  subscribeToClientById(clientId: string, onUpdate: (clientData: any | null) => void): () => void {
    const unsub = onSnapshot(doc(db, 'clients', clientId), (snap) => {
      if (snap.exists()) {
        onUpdate({ id: snap.id, ...snap.data() });
      } else {
        onUpdate(null);
      }
    }, (err) => {
      console.error("Error fetching client by id:", err);
      onUpdate(null);
    });
    return unsub;
  },

  subscribeToClients(isMaster: boolean, clients: any[] | null | undefined, onUpdate: (clientsList: any[]) => void): () => void {
    if (isMaster) {
      const q = query(collection(db, "clients"));
      return onSnapshot(q, (snapshot) => {
        onUpdate(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
    } else if (clients && clients.length > 0) {
      const clientIds = clients.map((c: any) => c.id);
      if (clientIds.length <= 10) {
        const q = query(collection(db, "clients"), where("__name__", "in", clientIds));
        return onSnapshot(q, (snapshot) => {
          onUpdate(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
      } else {
        const q = query(collection(db, "clients"));
        return onSnapshot(q, (snapshot) => {
          const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          onUpdate(all.filter(c => clientIds.includes(c.id)));
        });
      }
    } else {
      onUpdate([]);
      return () => {};
    }
  },

  async addClient(clientFinalData: any): Promise<string> {
    const docRef = (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // addDoc(collection(db, "clients"), clientFinalData);
    return docRef.id;
  },

  async updateClient(editingId: string, clientData: any): Promise<void> {
    (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // updateDoc(doc(db, "clients", editingId), clientData);
  },

  async deleteClientCascade(clientId: string, collectionsToClean: string[]): Promise<void> {
    for (const coll of collectionsToClean) {
      try {
        const q = query(collection(db, coll), where("clientId", "==", clientId));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const deletePromises = snap.docs.map(d => (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // deleteDoc(doc(db, coll, d.id)));
          await Promise.all(deletePromises);
        }
      } catch (e) {
        console.warn(`Erro ao limpar coleção ${coll} (pode não existir dados ou sem permissão):`, e);
      }
    }
    (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // deleteDoc(doc(db, "clients", clientId));
  },

  async approveClient(clientId: string): Promise<void> {
    (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // updateDoc(doc(db, "clients", clientId), { approvalStatus: "Approved" });
  },

  subscribeToPartners(onUpdate: (partnersList: any[]) => void): () => void {
    const q = query(collection(db, "partners"));
    return onSnapshot(q, (snapshot) => {
      onUpdate(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  },

  async createAccountPlanBatch(plans: any[]): Promise<void> {
    const batch = plans.map(acc => {
       return (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // addDoc(collection(db, "account_plans"), acc);
    });
    await Promise.all(batch);
  },

  getServerTimestamp() {
    return serverTimestamp();
  }
};
