import { useState } from 'react';
import { useRuntimePerformancePageAdapter } from '../adapters/ui/useRuntimePerformancePageAdapter.ts';

export function useRuntimePerformancePageViewModel({ clientId }: any) {
  const { perfData, loading } = useRuntimePerformancePageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('runtimeperf');

  return {
    state: { perfData, loading, activeTab },
    computed: { averageResponseTimeMs: 14 },
    actions: { setActiveTab }
  };
}
