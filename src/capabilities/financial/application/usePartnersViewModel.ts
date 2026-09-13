import { useState } from 'react';
import { usePartnersAdapter } from '../../../adapters/ui/usePartnersAdapter.ts';

export function usePartnersViewModel({ clientId }: any) {
  const { partners, loading } = usePartnersAdapter(clientId);
  const [activeTab, setActiveTab] = useState('list');

  return {
    state: {
      partners,
      loading,
      activeTab
    },
    computed: {
      totalPartners: partners.length
    },
    actions: {
      setActiveTab
    }
  };
}
