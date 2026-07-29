import { useState } from 'react';
import { useGovernanceDashboardPageAdapter } from '../adapters/ui/useGovernanceDashboardPageAdapter.ts';

export function useGovernanceDashboardPageViewModel({ clientId }: any) {
  const { governanceDashboardData, loading } = useGovernanceDashboardPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('governance');

  return {
    state: { governanceDashboardData, loading, activeTab },
    computed: { governanceScore: 95.8 },
    actions: { setActiveTab }
  };
}
