import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';
import { blockedFirestoreWrite } from '../../../../../lib/blockedFirestoreWrite';

export class FirestoreMethodologicalAnalysisAdapter {
  static async getAnalysis(clientId: string, year: number, month: number): Promise<{ id: string, docData: any } | null> {
    const q = query(
      collection(db, 'methodological_analyses'),
      where('clientId', '==', clientId),
      where('year', '==', year),
      where('month', '==', month)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      return { id: snap.docs[0].id, docData: snap.docs[0].data() };
    }
    return null;
  }

  static async createAnalysis(payload: any): Promise<string> {
    const docRef: any = blockedFirestoreWrite(); // addDoc(collection(db, 'methodological_analyses'), {
      // ...payload,
      // createdAt: serverTimestamp(),
    // });
    return docRef.id;
  }

  static async updateAnalysisReprocessed(id: string, reprocessedData: any): Promise<void> {
    blockedFirestoreWrite(); // updateDoc(doc(db, 'methodological_analyses', id), {
      // reprocessed: {
        // ...reprocessedData,
        // reprocessedAt: new Date().toISOString()
      // }
    // });
  }
}
