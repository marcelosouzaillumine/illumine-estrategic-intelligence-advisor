import { useState, useEffect } from 'react';
import { query, collection, where, doc, deleteDoc, writeBatch, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export function useFinancialPositionAdapter(selectedClient: string) {
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedClient) {
      setPositions([]);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'financial_positions'),
      where('clientId', '==', selectedClient)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPositions(dbDocs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching positions:", error);
      setPositions([]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedClient]);

  const handleDeleteAccount = async (id: string) => {
    setIsDeletingId(id);
    try {
      await deleteDoc(doc(db, 'financial_positions', id));
      const q = query(collection(db, 'bank_transactions'), where('accountId', '==', id));
      const snap = await getDocs(q);
      const batch = writeBatch(db);
      snap.docs.forEach(d => batch.delete(d.ref));
      await batch.commit();
      return true;
    } catch (err) {
      console.error("Error deleting account:", err);
      return false;
    } finally {
      setIsDeletingId(null);
    }
  };

  return {
    positions,
    loading,
    isDeletingId,
    handleDeleteAccount
  };
}
