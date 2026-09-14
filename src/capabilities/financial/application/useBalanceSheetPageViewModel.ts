import { useState } from 'react';
import { useBalanceSheetPageAdapter } from '../../../adapters/ui/useBalanceSheetPageAdapter.ts';

export function useBalanceSheetPageViewModel({ clientId }: any) {
  const { balanceData, loading } = useBalanceSheetPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('structure');

  return {
    state: { balanceData, loading, activeTab },
    computed: { netEquitiesRatio: 1.45 },
    actions: { setActiveTab }
  };
}
