import { useState } from 'react';
import { useTransactionsAdapter } from '../adapters/ui/useTransactionsAdapter.ts';

export function useTransactionsViewModel({ clientId }: any) {
  const { transactions, loading } = useTransactionsAdapter(clientId);
  const [activeTab, setActiveTab] = useState('list');

  return {
    state: {
      transactions,
      loading,
      activeTab
    },
    computed: {
      transactionsCount: transactions.length
    },
    actions: {
      setActiveTab
    }
  };
}
