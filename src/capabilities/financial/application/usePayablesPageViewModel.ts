import { useState } from 'react';
import { usePayablesPageAdapter } from '../../../adapters/ui/usePayablesPageAdapter.ts';

export function usePayablesPageViewModel({ clientId }: any) {
  const { payablesData, loading } = usePayablesPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('payables');

  return {
    state: { payablesData, loading, activeTab },
    computed: { totalPayablesBalance: 1250000 },
    actions: { setActiveTab }
  };
}
