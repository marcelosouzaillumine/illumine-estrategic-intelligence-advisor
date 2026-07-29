import { useState } from 'react';
import { useLoansPageAdapter } from '../adapters/ui/useLoansPageAdapter.ts';

export function useLoansPageViewModel({ clientId }: any) {
  const { loansData, loading } = useLoansPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('loans');

  return {
    state: { loansData, loading, activeTab },
    computed: { totalDebtBalance: 4500000 },
    actions: { setActiveTab }
  };
}
