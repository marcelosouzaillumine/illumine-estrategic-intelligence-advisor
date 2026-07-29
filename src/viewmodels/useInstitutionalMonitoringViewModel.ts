import { useState } from 'react';
import { useInstitutionalMonitoringAdapter } from '../adapters/ui/useInstitutionalMonitoringAdapter';

export function useInstitutionalMonitoringViewModel({ clientId }: any) {
  const { monitors, loading } = useInstitutionalMonitoringAdapter(clientId);
  const [activeTab, setActiveTab] = useState('monitoring');

  return {
    state: {
      monitors,
      loading,
      activeTab
    },
    computed: {
      uptimeScore: 99.98
    },
    actions: {
      setActiveTab
    }
  };
}
