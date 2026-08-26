import { collection, query, where, onSnapshot, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export class FirestoreOrganizationalAdapter {
  static listenToOrgChartByClient(clientId: string, onUpdate: (nodes: any[]) => void): () => void {
    const q = query(collection(db, 'org_charts'), where('clientId', '==', clientId));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        onUpdate(data.nodes || []);
      } else {
        onUpdate([]);
      }
    });
  }

  static async saveOrgChart(clientId: string, nodes: any[]): Promise<void> {
    const docRef = doc(db, 'org_charts', `org_${clientId}`);
    (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // setDoc(docRef, {
      clientId,
      nodes,
      updatedAt: serverTimestamp()
    });
  }
}
