import { useState } from 'react';
import { usePurchasingPageAdapter } from '../adapters/ui/usePurchasingPageAdapter.ts';

export function usePurchasingPageViewModel({ clientId }: any) {
  const { purchasingData, loading } = usePurchasingPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('purchasing');

  return {
    state: { purchasingData, loading, activeTab },
    computed: { pendingOrdersCount: 8 },
    actions: { setActiveTab }
  };
}
