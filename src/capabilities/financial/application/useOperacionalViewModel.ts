import { useState } from 'react';
import { useOperacionalAdapter } from '../../../adapters/ui/useOperacionalAdapter.ts';

export function useOperacionalViewModel({ clientId }: any) {
  const { data, loading } = useOperacionalAdapter(clientId);
  const [activeTab, setActiveTab] = useState('overview');

  return {
    state: {
      data,
      loading,
      activeTab
    },
    computed: {
      operationalEfficiencyScore: 92.4
    },
    actions: {
      setActiveTab
    }
  };
}
