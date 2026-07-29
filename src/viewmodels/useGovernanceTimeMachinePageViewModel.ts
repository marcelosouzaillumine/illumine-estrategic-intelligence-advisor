import { useState } from 'react';
import { useGovernanceTimeMachinePageAdapter } from '../adapters/ui/useGovernanceTimeMachinePageAdapter.ts';

export function useGovernanceTimeMachinePageViewModel({ clientId }: any) {
  const { timelineData, loading } = useGovernanceTimeMachinePageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('timemachine');

  return {
    state: { timelineData, loading, activeTab },
    computed: { historicalSnapshotsCount: 24 },
    actions: { setActiveTab }
  };
}
