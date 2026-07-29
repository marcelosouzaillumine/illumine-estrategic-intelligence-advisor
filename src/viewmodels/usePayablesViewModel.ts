import { useState } from 'react';
import { usePayablesAdapter } from '../adapters/ui/usePayablesAdapter.ts';

export function usePayablesViewModel({ clientId }: any) {
  const { payablesList, loading } = usePayablesAdapter(clientId);
  const [activeTab, setActiveTab] = useState('list');

  return {
    state: {
      payablesList,
      loading,
      activeTab
    },
    computed: {
      totalPayablesAmount: 450000.0
    },
    actions: {
      setActiveTab
    }
  };
}
