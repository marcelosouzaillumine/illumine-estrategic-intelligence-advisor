import { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

export function useCleanupToolPageAdapter() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<any[]>([]);

  const searchClientByCnpj = async (cnpj: string) => {
    setLoading(true);
    try {
      const q = query(collection(db, 'clients'), where('cnpj', '==', cnpj));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].id;
      }
      return null;
    } catch (e) {
      console.error(e);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    status,
    setStatus,
    setLoading,
    searchClientByCnpj
  };
}
