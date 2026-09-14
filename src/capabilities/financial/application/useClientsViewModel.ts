import { useState } from 'react';
import { useClientsAdapter } from '../../../adapters/ui/useClientsAdapter.ts';

export function useClientsViewModel({ clientId }: any) {
  const { clientsList, loading } = useClientsAdapter(clientId);
  const [activeTab, setActiveTab] = useState('list');

  return {
    state: {
      clientsList,
      loading,
      activeTab
    },
    computed: {
      totalClients: clientsList.length
    },
    actions: {
      setActiveTab
    }
  };
}
