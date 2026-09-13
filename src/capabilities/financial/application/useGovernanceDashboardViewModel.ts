import { useState } from 'react';
import { useGovernanceDashboardAdapter } from '../../../adapters/ui/useGovernanceDashboardAdapter.ts';

export function useGovernanceDashboardViewModel({ clientId }: any) {
  const { governanceData, loading } = useGovernanceDashboardAdapter(clientId);
  const [activeTab, setActiveTab] = useState('overview');

  return {
    state: {
      governanceData,
      loading,
      activeTab
    },
    computed: {
      maturityScore: 82.5
    },
    actions: {
      setActiveTab
    }
  };
}
