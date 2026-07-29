import { useState } from 'react';
import { useInstitutionalIOSPageAdapter } from '../adapters/ui/useInstitutionalIOSPageAdapter.ts';

export function useInstitutionalIOSPageViewModel({ clientId }: any) {
  const { iosData, loading } = useInstitutionalIOSPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('ios');

  return {
    state: { iosData, loading, activeTab },
    computed: { systemIntegrityHealthPct: 99.5 },
    actions: { setActiveTab }
  };
}
