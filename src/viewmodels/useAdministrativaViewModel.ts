import { useState } from 'react';
import { useAdministrativaAdapter } from '../adapters/ui/useAdministrativaAdapter.ts';

export function useAdministrativaViewModel({ clientId }: any) {
  const { adminData, loading } = useAdministrativaAdapter(clientId);
  const [activeTab, setActiveTab] = useState('overview');

  return {
    state: { adminData, loading, activeTab },
    computed: { opexEfficiencyPct: 94.2 },
    actions: { setActiveTab }
  };
}
