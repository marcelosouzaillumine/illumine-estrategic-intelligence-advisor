import { useState } from 'react';
import { useGovernanceOrchestrationPageAdapter } from '../adapters/ui/useGovernanceOrchestrationPageAdapter.ts';

export function useGovernanceOrchestrationPageViewModel({ clientId }: any) {
  const { orchestrationData, loading } = useGovernanceOrchestrationPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('orchestration');

  return {
    state: { orchestrationData, loading, activeTab },
    computed: { activePipelinesCount: 6 },
    actions: { setActiveTab }
  };
}
