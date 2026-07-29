import { useState } from 'react';
import { useRuntimeObservabilityPageAdapter } from '../adapters/ui/useRuntimeObservabilityPageAdapter.ts';

export function useRuntimeObservabilityPageViewModel({ clientId }: any) {
  const { runtimeObsData, loading } = useRuntimeObservabilityPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('runtimeobs');

  return {
    state: { runtimeObsData, loading, activeTab },
    computed: { systemUptimePct: 99.99 },
    actions: { setActiveTab }
  };
}
