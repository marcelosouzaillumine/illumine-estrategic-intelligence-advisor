import { useState } from 'react';
import { useExecutiveScenarioLabPageAdapter } from '../adapters/ui/useExecutiveScenarioLabPageAdapter.ts';

export function useExecutiveScenarioLabPageViewModel({ clientId }: any) {
  const { scenarios, loading } = useExecutiveScenarioLabPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('scenarios');

  return {
    state: { scenarios, loading, activeTab },
    computed: { stressTestPassRatePct: 95.0 },
    actions: { setActiveTab }
  };
}
