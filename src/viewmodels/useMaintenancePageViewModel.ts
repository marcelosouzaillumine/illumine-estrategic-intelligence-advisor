import { useState } from 'react';
import { useMaintenancePageAdapter } from '../adapters/ui/useMaintenancePageAdapter.ts';

export function useMaintenancePageViewModel({ clientId }: any) {
  const { maintenanceData, loading } = useMaintenancePageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('maintenance');

  return {
    state: { maintenanceData, loading, activeTab },
    computed: { systemHealthPct: 100.0 },
    actions: { setActiveTab }
  };
}
