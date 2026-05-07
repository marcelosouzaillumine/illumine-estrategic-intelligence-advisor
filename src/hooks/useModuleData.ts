
import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export function useModuleData<T>(collectionName: string, clientId: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId || !auth.currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, collectionName),
      where('clientId', '==', clientId),
      where('ownerId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
      setData(items);
      setLoading(false);
    }, (err) => {
      console.error(`Error fetching ${collectionName}:`, err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName, clientId]);

  const add = async (item: any) => {
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, collectionName), {
        ...item,
        clientId,
        ownerId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (err: any) {
      console.error(`Error adding to ${collectionName}:`, err);
      throw err;
    }
  };

  const update = async (id: string, item: any) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...item,
        updatedAt: serverTimestamp()
      });
    } catch (err: any) {
      console.error(`Error updating ${collectionName}:`, err);
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err: any) {
      console.error(`Error deleting from ${collectionName}:`, err);
      throw err;
    }
  };

  return { data, loading, error, add, update, remove };
}
