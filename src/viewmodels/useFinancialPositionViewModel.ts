import { useState } from 'react';
import { useFinancialPositionAdapter } from '../adapters/ui/useFinancialPositionAdapter.ts';

export function useFinancialPositionViewModel({ clientId }: any) {
  const { positions, loading } = useFinancialPositionAdapter(clientId);
  const [activeTab, setActiveTab] = useState('position');

  return {
    state: {
      positions,
      loading,
      activeTab
    },
    computed: {
      positionsCount: positions.length
    },
    actions: {
      setActiveTab
    }
  };
}
