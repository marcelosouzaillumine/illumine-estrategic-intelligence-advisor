import { useState } from 'react';
import { usePilotMonitoringDashboardAdapter } from '../adapters/ui/usePilotMonitoringDashboardAdapter.ts';

export function usePilotMonitoringDashboardViewModel({ clientId }: any) {
  const { pilotMonitoringData, loading } = usePilotMonitoringDashboardAdapter(clientId);
  const [activeTab, setActiveTab] = useState('pilotmonitoring');

  return {
    state: { pilotMonitoringData, loading, activeTab },
    computed: { isPilotActive: true },
    actions: { setActiveTab }
  };
}
