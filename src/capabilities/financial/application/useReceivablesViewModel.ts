import { useState } from 'react';
import { useReceivablesAdapter } from '../../../adapters/ui/useReceivablesAdapter.ts';

export function useReceivablesViewModel({ clientId }: any) {
  const { receivablesList, loading } = useReceivablesAdapter(clientId);
  const [activeTab, setActiveTab] = useState('list');

  return {
    state: {
      receivablesList,
      loading,
      activeTab
    },
    computed: {
      totalReceivablesAmount: 680000.0
    },
    actions: {
      setActiveTab
    }
  };
}
