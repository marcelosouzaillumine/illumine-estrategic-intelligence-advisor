import { useState } from 'react';
import { useViabilityPageAdapter } from '../adapters/ui/useViabilityPageAdapter.ts';

export function useViabilityPageViewModel({ clientId }: any) {
  const { viabilityData, loading } = useViabilityPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('viability');

  const capability: any = {
    status: 'UNAVAILABLE',
    reason: 'VIABILITY_PROJECTS_DATA_SOURCE_NOT_MIGRATED'
  };

  return {
    state: { viabilityData, loading, activeTab, capability },
    computed: { projectIrrPct: 24.8 },
    actions: { setActiveTab }
  };
}
