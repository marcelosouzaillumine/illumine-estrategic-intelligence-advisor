import { useState } from 'react';
import { useInstitutionalMonitoringPageAdapter } from '../../../adapters/ui/useInstitutionalMonitoringPageAdapter.ts';

export function useInstitutionalMonitoringPageViewModel({ clientId }: any) {
  const { monitoringData, loading } = useInstitutionalMonitoringPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('monitoring');

  return {
    state: { monitoringData, loading, activeTab },
    computed: { telemetryUptimePct: 99.99 },
    actions: { setActiveTab }
  };
}
