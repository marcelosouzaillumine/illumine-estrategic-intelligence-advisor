import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db, auth } from '../lib/firebase';

export function useModuleData<T>(collectionName: string, clientId: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);

  // Resolve the auth user reactively — auth.currentUser is null on the first tick
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubAuth();
  }, []);

  // Subscribe to Firestore only once we have a confirmed user and clientId
  useEffect(() => {
    if (!clientId || !currentUser) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, collectionName),
      where('clientId', '==', clientId),
      where('ownerId', '==', currentUser.uid)
    );

    const unsubSnapshot = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as T[];
      setData(items);
      setLoading(false);
    }, (err) => {
      console.error(`[useModuleData] Error fetching ${collectionName}:`, err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubSnapshot();
  }, [collectionName, clientId, currentUser]);

  const add = async (item: any): Promise<string> => {
    const user = auth.currentUser ?? currentUser;
    if (!user) {
      const msg = `[useModuleData] Usuário não autenticado ao salvar em "${collectionName}". Faça login novamente.`;
      console.error(msg);
      setError(msg);
      throw new Error(msg);
    }
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...item,
        clientId,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err: any) {
      console.error(`[useModuleData] Error adding to ${collectionName}:`, err);
      setError(err.message);
      throw err;
    }
  };

  const update = async (id: string, item: any) => {
    const user = auth.currentUser ?? currentUser;
    if (!user) {
      const msg = `[useModuleData] Usuário não autenticado ao atualizar em "${collectionName}".`;
      console.error(msg);
      setError(msg);
      throw new Error(msg);
    }
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, { ...item, updatedAt: serverTimestamp() });
    } catch (err: any) {
      console.error(`[useModuleData] Error updating ${collectionName}:`, err);
      setError(err.message);
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err: any) {
      console.error(`[useModuleData] Error deleting from ${collectionName}:`, err);
      setError(err.message);
      throw err;
    }
  };

  return { data, loading, error, add, update, remove };
}
