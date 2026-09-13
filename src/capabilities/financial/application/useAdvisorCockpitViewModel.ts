import { useState } from 'react';
import { useAdvisorCockpitAdapter } from '../../../adapters/ui/useAdvisorCockpitAdapter.ts';

export function useAdvisorCockpitViewModel() {
  const { advisoryItems, loading } = useAdvisorCockpitAdapter();
  const [activeTab, setActiveTab] = useState('cockpit');

  return {
    state: { advisoryItems, loading, activeTab },
    computed: { openDirectivesCount: 5 },
    actions: { setActiveTab }
  };
}
