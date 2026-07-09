import { useState, useEffect } from 'react';
import { FirestoreAccountPlansAdapter } from '../adapters/persistence/FirestoreAccountPlansAdapter';
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
    
    const unsubscribe = FirestoreAccountPlansAdapter.listenToAccountPlanGeneric(
      clientId, 
      planType, 
      (docs) => {
        if (docs.length === 0) {
          setAccounts(DATA.accountPlanPadrão || []);
        } else {
          setAccounts(docs);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching accounts:", error);
        setAccounts(DATA.accountPlanPadrão || []);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [clientId, planType]);

  return { accounts, loading };
}
