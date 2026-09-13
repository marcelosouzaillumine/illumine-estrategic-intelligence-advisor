import { useState } from 'react';
import { useEstruturaGovernancaAdapter } from '../../../adapters/ui/useEstruturaGovernancaAdapter.ts';

export function useEstruturaGovernancaViewModel({ clientId }: any) {
  const { governanceStructure, loading } = useEstruturaGovernancaAdapter(clientId);
  const [activeTab, setActiveTab] = useState('structure');

  return {
    state: {
      governanceStructure,
      loading,
      activeTab
    },
    computed: {
      governanceCount: 0
    },
    actions: {
      setActiveTab
    }
  };
}
