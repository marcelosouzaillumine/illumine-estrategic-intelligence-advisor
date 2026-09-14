import { useState } from 'react';
import { useRuntimePerformanceAdapter } from '../../../adapters/ui/useRuntimePerformanceAdapter.ts';

export function useRuntimePerformanceViewModel() {
  const { perfData, loading } = useRuntimePerformanceAdapter();
  const [activeTab, setActiveTab] = useState('performance');

  return {
    state: { perfData, loading, activeTab },
    computed: { avgLatencyMs: 42.5 },
    actions: { setActiveTab }
  };
}
