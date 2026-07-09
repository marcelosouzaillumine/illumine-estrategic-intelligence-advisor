import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export type BankTransaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
  category?: string;
};

export function useBankTransactionsModalAdapter(account: any) {
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [accountPlan, setAccountPlan] = useState<any[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Account Plan for categorization
        const qPlan = query(
          collection(db, 'account_plans'),
          where('clientId', '==', account.clientId || ''),
          where('planType', '==', 'accounting')
        );
        const snapPlan = await getDocs(qPlan);
        setAccountPlan(snapPlan.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => (a as any).code.localeCompare((b as any).code)));

        // Fetch Transactions
        const q = query(
          collection(db, 'bank_transactions'),
          where('accountId', '==', account.id)
        );
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as BankTransaction));
        
        if (data.length > 0) {
          setTransactions(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        } else {
          setTransactions([]);
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [account.id, account.clientId]);

  const handleUpdateCategory = async (transactionId: string, category: string) => {
    if (transactionId.startsWith('m')) return; // Ignore mock
    setUpdatingId(transactionId);
    try {
      await updateDoc(doc(db, 'bank_transactions', transactionId), { category });
      setTransactions(prev => prev.map(t => t.id === transactionId ? { ...t, category } : t));
    } catch (err) {
      console.error("Error updating category:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  return {
    transactions,
    loading,
    accountPlan,
    updatingId,
    handleUpdateCategory
  };
}
