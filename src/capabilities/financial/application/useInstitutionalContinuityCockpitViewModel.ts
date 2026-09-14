import { useState } from 'react';
import { useInstitutionalContinuityCockpitAdapter } from '../../../adapters/ui/useInstitutionalContinuityCockpitAdapter.ts';

export function useInstitutionalContinuityCockpitViewModel({ clientId }: any) {
  const { continuityData, loading } = useInstitutionalContinuityCockpitAdapter(clientId);
  const [activeTab, setActiveTab] = useState('status');

  return {
    state: {
      continuityData,
      loading,
      activeTab
    },
    computed: {
      successionAdherencePct: 91.0
    },
    actions: {
      setActiveTab
    }
  };
}
