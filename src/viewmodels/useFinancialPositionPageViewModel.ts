import { useState } from 'react';
import { useFinancialPositionPageAdapter } from '../adapters/ui/useFinancialPositionPageAdapter.ts';

export function useFinancialPositionPageViewModel({ clientId }: any) {
  const { positionData, loading } = useFinancialPositionPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('position');

  return {
    state: { positionData, loading, activeTab },
    computed: { netAssetValue: 28500000 },
    actions: { setActiveTab }
  };
}
