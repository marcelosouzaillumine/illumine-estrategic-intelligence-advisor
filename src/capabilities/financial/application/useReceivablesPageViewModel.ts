import { useState } from 'react';
import { useReceivablesPageAdapter } from '../../../adapters/ui/useReceivablesPageAdapter.ts';

export function useReceivablesPageViewModel({ clientId }: any) {
  const { receivablesData, loading } = useReceivablesPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('receivables');

  return {
    state: { receivablesData, loading, activeTab },
    computed: { totalReceivablesBalance: 3450000 },
    actions: { setActiveTab }
  };
}
