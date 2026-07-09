import { useState, useEffect } from 'react';
import { FirestoreGenericCollectionAdapter } from '../adapters/persistence/FirestoreGenericCollectionAdapter';
import { FirestoreAuthAdapter } from '../adapters/persistence/FirestoreAuthAdapter';



export function useModuleData<T>(collectionName: string, clientId: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(FirestoreAuthAdapter.getCurrentUser());

  // Use interval to check auth state since we removed direct onAuthStateChanged
  useEffect(() => {
    const interval = setInterval(() => {
      const user = FirestoreAuthAdapter.getCurrentUser();
      if (user && !currentUser) {
        setCurrentUser(user);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Subscribe to Firestore only once we have a confirmed user and clientId
  useEffect(() => {
    if (!clientId || !currentUser) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubSnapshot = FirestoreGenericCollectionAdapter.listenToCollection<T>(
      collectionName,
      clientId,
      currentUser.uid,
      (items) => {
        setData(items);
        setLoading(false);
      },
      (err) => {
        console.error(`[useModuleData] Error fetching ${collectionName}:`, err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubSnapshot();
  }, [collectionName, clientId, currentUser]);

  const add = async (item: any): Promise<string> => {
    const user = FirestoreAuthAdapter.getCurrentUser() ?? currentUser;
    if (!user) {
      const msg = `[useModuleData] Usuário não autenticado ao salvar em "${collectionName}". Faça login novamente.`;
      console.error(msg);
      setError(msg);
      throw new Error(msg);
    }
    try {
      return await FirestoreGenericCollectionAdapter.addDocument(collectionName, item, clientId, user.uid);
    } catch (err: any) {
      console.error(`[useModuleData] Error adding to ${collectionName}:`, err);
      setError(err.message);
      throw err;
    }
  };

  const update = async (id: string, item: any) => {
    const user = FirestoreAuthAdapter.getCurrentUser() ?? currentUser;
    if (!user) {
      const msg = `[useModuleData] Usuário não autenticado ao atualizar em "${collectionName}".`;
      console.error(msg);
      setError(msg);
      throw new Error(msg);
    }
    try {
      await FirestoreGenericCollectionAdapter.updateDocument(collectionName, id, item);
    } catch (err: any) {
      console.error(`[useModuleData] Error updating ${collectionName}:`, err);
      setError(err.message);
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      await FirestoreGenericCollectionAdapter.deleteDocument(collectionName, id);
    } catch (err: any) {
      console.error(`[useModuleData] Error deleting from ${collectionName}:`, err);
      setError(err.message);
      throw err;
    }
  };

  return { data, loading, error, add, update, remove };
}
