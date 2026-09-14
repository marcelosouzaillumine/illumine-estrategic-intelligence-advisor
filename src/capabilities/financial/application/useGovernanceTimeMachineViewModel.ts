import { useState } from 'react';
import { useGovernanceTimeMachineAdapter } from '../../../adapters/ui/useGovernanceTimeMachineAdapter.ts';

export function useGovernanceTimeMachineViewModel({ clientId }: any) {
  const { historyData, loading } = useGovernanceTimeMachineAdapter(clientId);
  const [activeTab, setActiveTab] = useState('timeline');

  return {
    state: {
      historyData,
      loading,
      activeTab
    },
    computed: {
      totalMilestones: historyData.length
    },
    actions: {
      setActiveTab
    }
  };
}
