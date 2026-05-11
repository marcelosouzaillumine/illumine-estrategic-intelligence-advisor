import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DATA } from '../data';

export function useAccountPlan(clientId: string, planType?: 'accounting' | 'managerial') {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) {
      setAccounts(DATA.accountPlanPadrão || []);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    let q;
    if (planType) {
      q = query(
        collection(db, 'account_plans'),
        where('clientId', '==', clientId),
        where('planType', '==', planType),
        orderBy('code', 'asc')
      );
    } else {
      q = query(
        collection(db, 'account_plans'),
        where('clientId', '==', clientId),
        orderBy('code', 'asc')
      );
    }
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // If no specific planType requested and no docs found, try prioritizing managerial or fallback to standard
      if (docs.length === 0) {
        setAccounts(DATA.accountPlanPadrão || []);
      } else {
        // If no planType specified, and we have both, we might want to prioritize managerial in some views
        // But for a generic hook, we return what the query found.
        setAccounts(docs);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching accounts:", error);
      setAccounts(DATA.accountPlanPadrão || []);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [clientId, planType]);

  return { accounts, loading };
}
