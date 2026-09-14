import { useState } from 'react';
import { useMarketingComercialAdapter } from '../../../adapters/ui/useMarketingComercialAdapter.ts';

export function useMarketingComercialViewModel({ clientId }: any) {
  const { data, loading } = useMarketingComercialAdapter(clientId);
  const [activeTab, setActiveTab] = useState('overview');

  return {
    state: {
      data,
      loading,
      activeTab
    },
    computed: {
      customerAcquisitionCost: 120.5
    },
    actions: {
      setActiveTab
    }
  };
}
