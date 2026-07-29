import { useState } from 'react';
import { useInstitutionalObservabilityPageAdapter } from '../adapters/ui/useInstitutionalObservabilityPageAdapter.ts';

export function useInstitutionalObservabilityPageViewModel({ clientId }: any) {
  const { observabilityData, loading } = useInstitutionalObservabilityPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('observability');

  return {
    state: { observabilityData, loading, activeTab },
    computed: { telemetryUptimePct: 99.99 },
    actions: { setActiveTab }
  };
}
