import { useState } from 'react';
import { useCashFlowAdapter } from '../../../adapters/ui/useCashFlowAdapter.ts';

export function useCashFlowViewModel({ clientId }: any) {
  const { entries, loading } = useCashFlowAdapter(clientId);
  const [activeTab, setActiveTab] = useState('summary');

  return {
    state: {
      entries,
      loading,
      activeTab
    },
    computed: {
      netCashFlow: 85000.0
    },
    actions: {
      setActiveTab
    }
  };
}
