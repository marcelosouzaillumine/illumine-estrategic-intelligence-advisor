import { useState } from 'react';
import { useViabilityPageAdapter } from '../adapters/ui/useViabilityPageAdapter.ts';

export function useViabilityPageViewModel({ clientId }: any) {
  const { viabilityData, loading } = useViabilityPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('viability');

  return {
    state: { viabilityData, loading, activeTab },
    computed: { projectIrrPct: 24.8 },
    actions: { setActiveTab }
  };
}
