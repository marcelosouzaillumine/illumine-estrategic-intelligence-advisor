import { useState } from 'react';
import { useEFOSPageAdapter } from '../../../adapters/ui/useEFOSPageAdapter.ts';

export function useEFOSPageViewModel({ clientId }: any) {
  const { efosData, loading } = useEFOSPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('efos');

  return {
    state: { efosData, loading, activeTab },
    computed: { operationalEfficiencyPct: 91.2 },
    actions: { setActiveTab }
  };
}
