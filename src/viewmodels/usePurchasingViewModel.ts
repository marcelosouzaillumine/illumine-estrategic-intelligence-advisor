import { useState } from 'react';
import { usePurchasingAdapter } from '../adapters/ui/usePurchasingAdapter.ts';

export function usePurchasingViewModel({ clientId }: any) {
  const { orders, loading } = usePurchasingAdapter(clientId);
  const [activeTab, setActiveTab] = useState('orders');

  return {
    state: {
      orders,
      loading,
      activeTab
    },
    computed: {
      totalPurchases: 420000.0
    },
    actions: {
      setActiveTab
    }
  };
}
