import { useState } from 'react';
import { useInstitutionalIOSAdapter } from '../adapters/ui/useInstitutionalIOSAdapter.ts';

export function useInstitutionalIOSViewModel({ clientId }: any) {
  const { iosData, loading } = useInstitutionalIOSAdapter(clientId);
  const [activeTab, setActiveTab] = useState('overview');

  return {
    state: {
      iosData,
      loading,
      activeTab
    },
    computed: {
      operatingSystemScore: 89.1
    },
    actions: {
      setActiveTab
    }
  };
}
