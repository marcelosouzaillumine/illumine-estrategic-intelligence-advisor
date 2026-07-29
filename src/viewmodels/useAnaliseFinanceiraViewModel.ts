import { useState } from 'react';
import { useAnaliseFinanceiraAdapter } from '../adapters/ui/useAnaliseFinanceiraAdapter.ts';

export function useAnaliseFinanceiraViewModel({ clientId }: any) {
  const { finData, loading } = useAnaliseFinanceiraAdapter(clientId);
  const [activeTab, setActiveTab] = useState('ratios');

  return {
    state: { finData, loading, activeTab },
    computed: { currentRatio: 1.85 },
    actions: { setActiveTab }
  };
}
