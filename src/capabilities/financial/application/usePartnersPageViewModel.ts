import { useState } from 'react';
import { usePartnersPageAdapter } from '../../../adapters/ui/usePartnersPageAdapter.ts';

export function usePartnersPageViewModel({ clientId }: any) {
  const { partnersData, loading } = usePartnersPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('partners');

  return {
    state: { partnersData, loading, activeTab },
    computed: { activePartnersCount: 16 },
    actions: { setActiveTab }
  };
}
