import { useState } from 'react';
import { useDecisionGovernancePageAdapter } from '../../../adapters/ui/useDecisionGovernancePageAdapter.ts';

export function useDecisionGovernancePageViewModel() {
  const { governanceData, loading } = useDecisionGovernancePageAdapter();
  const [activeTab, setActiveTab] = useState('decisions');

  return {
    state: { governanceData, loading, activeTab },
    computed: { pendingDecisionsCount: 2 },
    actions: { setActiveTab }
  };
}
