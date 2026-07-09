import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export class FirestoreAssetsAdapter {
  static listenToAssetsByClient(clientId: string, onUpdate: (assets: any[]) => void): () => void {
    const q = query(
      collection(db, 'assets'),
      where('clientId', '==', clientId)
    );
    return onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      onUpdate(docs);
    });
  }
}
