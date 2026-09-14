import { useState } from 'react';
import { useAdvisorWorkspaceAdapter } from '../../../adapters/ui/useAdvisorWorkspaceAdapter.ts';

export function useAdvisorWorkspaceViewModel({ clientId }: any) {
  const { workspaceData, loading } = useAdvisorWorkspaceAdapter(clientId);
  const [activeTab, setActiveTab] = useState('workspace');

  return {
    state: { workspaceData, loading, activeTab },
    computed: { advisoryReadinessPct: 100 },
    actions: { setActiveTab }
  };
}
