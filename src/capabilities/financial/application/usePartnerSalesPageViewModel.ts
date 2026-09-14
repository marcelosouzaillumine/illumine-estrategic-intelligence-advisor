import { useState } from 'react';
import { usePartnerSalesPageAdapter } from '../../../adapters/ui/usePartnerSalesPageAdapter.ts';

export function usePartnerSalesPageViewModel({ clientId }: any) {
  const { partnerSalesData, loading } = usePartnerSalesPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('partnersales');

  return {
    state: { partnerSalesData, loading, activeTab },
    computed: { activePartnersCount: 24 },
    actions: { setActiveTab }
  };
}
