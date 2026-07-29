import { useState } from 'react';
import { useAdvisoryInsightsAdapter } from '../adapters/ui/useAdvisoryInsightsAdapter.ts';

export function useAdvisoryInsightsViewModel({ clientId }: any) {
  const { insights, loading } = useAdvisoryInsightsAdapter(clientId);
  const [activeTab, setActiveTab] = useState('insights');

  return {
    state: { insights, loading, activeTab },
    computed: { highImpactCount: 3 },
    actions: { setActiveTab }
  };
}
