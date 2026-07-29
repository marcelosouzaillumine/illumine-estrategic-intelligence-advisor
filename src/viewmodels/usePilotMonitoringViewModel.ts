import { useState } from 'react';
import { usePilotMonitoringAdapter } from '../adapters/ui/usePilotMonitoringAdapter';

export function usePilotMonitoringViewModel({ clientId }: any) {
  const { pilots, loading } = usePilotMonitoringAdapter(clientId);
  const [activeTab, setActiveTab] = useState('pilots');

  return {
    state: {
      pilots,
      loading,
      activeTab
    },
    computed: {
      activeCount: pilots.length
    },
    actions: {
      setActiveTab
    }
  };
}
