import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export function usePurchasingAdapter(clientId: string) {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    const q = query(
      collection(db, 'purchases'),
      where('clientId', '==', clientId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPurchases(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [clientId]);

  return {
    purchases,
    loading
  };
}
