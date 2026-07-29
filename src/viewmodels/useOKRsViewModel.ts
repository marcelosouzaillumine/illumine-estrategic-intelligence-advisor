import { useState } from 'react';
import { useOKRsAdapter } from '../adapters/ui/useOKRsAdapter.ts';

export function useOKRsViewModel({ clientId }: any) {
  const { okrs, loading } = useOKRsAdapter(clientId);
  const [activeTab, setActiveTab] = useState('list');

  return {
    state: {
      okrs,
      loading,
      activeTab
    },
    computed: {
      totalGoals: okrs.length
    },
    actions: {
      setActiveTab
    }
  };
}
