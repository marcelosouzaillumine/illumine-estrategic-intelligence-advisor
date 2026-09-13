import { useState } from 'react';
import { useExecutiveDecisionCenterAdapter } from '../../../adapters/ui/useExecutiveDecisionCenterAdapter.ts';

export function useExecutiveDecisionCenterViewModel({ clientId }: any) {
  const { decisionsData, loading } = useExecutiveDecisionCenterAdapter(clientId);
  const [activeTab, setActiveTab] = useState('center');

  return {
    state: { decisionsData, loading, activeTab },
    computed: { pendingApprovalCount: 4 },
    actions: { setActiveTab }
  };
}
