import { useState } from 'react';
import { useAxisDashboardAdapter } from '../adapters/ui/useAxisDashboardAdapter.ts';

export function useAxisDashboardViewModel({ clientId }: any) {
  const { axisMetrics, loading } = useAxisDashboardAdapter(clientId);
  const [activeTab, setActiveTab] = useState('axes');

  return {
    state: { axisMetrics, loading, activeTab },
    computed: { globalAxisScore: 91.2 },
    actions: { setActiveTab }
  };
}
