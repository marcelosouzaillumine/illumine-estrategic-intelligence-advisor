import { useState } from 'react';
import { useLoansAdapter } from '../../../adapters/ui/useLoansAdapter.ts';

export function useLoansViewModel({ clientId }: any) {
  const { loans, loading } = useLoansAdapter(clientId);
  const [activeTab, setActiveTab] = useState('list');

  return {
    state: {
      loans,
      loading,
      activeTab
    },
    computed: {
      totalDebt: 500000.0
    },
    actions: {
      setActiveTab
    }
  };
}
