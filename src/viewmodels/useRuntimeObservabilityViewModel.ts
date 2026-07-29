import { useState } from 'react';
import { useRuntimeObservabilityAdapter } from '../adapters/ui/useRuntimeObservabilityAdapter.ts';

export function useRuntimeObservabilityViewModel() {
  const { metrics, loading } = useRuntimeObservabilityAdapter();
  const [activeTab, setActiveTab] = useState('live');

  return {
    state: { metrics, loading, activeTab },
    computed: { uptimePct: 99.98 },
    actions: { setActiveTab }
  };
}
