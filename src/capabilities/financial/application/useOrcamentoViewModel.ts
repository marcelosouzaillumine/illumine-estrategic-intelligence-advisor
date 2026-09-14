import { useState } from 'react';
import { useOrcamentoAdapter } from '../../../adapters/ui/useOrcamentoAdapter.ts';

export function useOrcamentoViewModel({ clientId }: any) {
  const { data, loading } = useOrcamentoAdapter(clientId);
  const [activeTab, setActiveTab] = useState('summary');

  return {
    state: {
      data,
      loading,
      activeTab
    },
    computed: {
      budgetDeviationPct: 3.4
    },
    actions: {
      setActiveTab
    }
  };
}
