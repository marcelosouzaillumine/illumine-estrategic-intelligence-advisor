import { useState } from 'react';
import { useExecutiveAdvisoryInsightsPageAdapter } from '../adapters/ui/useExecutiveAdvisoryInsightsPageAdapter.ts';

export function useExecutiveAdvisoryInsightsPageViewModel({ clientId }: any) {
  const { insights, loading } = useExecutiveAdvisoryInsightsPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('insights');

  return {
    state: { insights, loading, activeTab },
    computed: { highPriorityInsightsCount: 3 },
    actions: { setActiveTab }
  };
}
