import { useState } from 'react';
import { useMarketingComercialPageAdapter } from '../../../adapters/ui/useMarketingComercialPageAdapter.ts';

export function useMarketingComercialPageViewModel({ clientId }: any) {
  const { marketingData, loading } = useMarketingComercialPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('marketing');

  return {
    state: { marketingData, loading, activeTab },
    computed: { cacPaybackMonths: 4.2 },
    actions: { setActiveTab }
  };
}
