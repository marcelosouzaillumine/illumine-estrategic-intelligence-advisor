import { useState } from 'react';
import { useInstitutionalDigitalTwinAdapter } from '../../../adapters/ui/useInstitutionalDigitalTwinAdapter.ts';

export function useInstitutionalDigitalTwinViewModel({ clientId }: any) {
  const { twinData, loading } = useInstitutionalDigitalTwinAdapter(clientId);
  const [activeTab, setActiveTab] = useState('simulation');

  return {
    state: {
      twinData,
      loading,
      activeTab
    },
    computed: {
      syncHealthScore: 94.2
    },
    actions: {
      setActiveTab
    }
  };
}
