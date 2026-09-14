import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';
import { FirestoreAuthAdapter } from '../../../../../adapters/persistence/FirestoreAuthAdapter';
import { blockedFirestoreWrite } from '../../../../../lib/blockedFirestoreWrite';

export class FirestoreGenericCollectionAdapter {
  static listenToCollection<T>(
    collectionName: string,
    clientId: string,
    ownerId: string,
    onUpdate: (items: T[]) => void,
    onError: (err: any) => void
  ): () => void {
    const q = query(
      collection(db, collectionName),
      where('clientId', '==', clientId),
      where('ownerId', '==', ownerId)
    );

    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as T[];
      onUpdate(items);
    }, onError);
  }

  static async addDocument(collectionName: string, item: any, clientId: string, ownerId: string): Promise<string> {
    const docRef: any = blockedFirestoreWrite(); // addDoc(collection(db, collectionName), {
      // ...item,
      // clientId,
      // ownerId,
      // createdAt: serverTimestamp(),
      // updatedAt: serverTimestamp(),
    // });
    return docRef.id;
  }

  static async updateDocument(collectionName: string, id: string, item: any): Promise<void> {
    const docRef = doc(db, collectionName, id);
    blockedFirestoreWrite(); // updateDoc(docRef, { ...item, updatedAt: serverTimestamp() });
  }

  static async deleteDocument(collectionName: string, id: string): Promise<void> {
    blockedFirestoreWrite(); // deleteDoc(doc(db, collectionName, id));
  }
}
