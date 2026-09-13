import { useState } from 'react';
import { useDashboardPageAdapter } from '../../../adapters/ui/useDashboardPageAdapter.ts';

export function useDashboardPageViewModel({ clientId }: any) {
  const { dashboardData, loading } = useDashboardPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('overview');

  return {
    state: { dashboardData, loading, activeTab },
    computed: { overallPerformanceScore: 94.5 },
    actions: { setActiveTab }
  };
}
