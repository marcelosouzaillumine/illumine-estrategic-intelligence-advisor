import { useState } from 'react';
import { usePilotExperienceDashboardAdapter } from '../../../adapters/ui/usePilotExperienceDashboardAdapter.ts';

export function usePilotExperienceDashboardViewModel({ clientId }: any) {
  const { pilotData, loading } = usePilotExperienceDashboardAdapter(clientId);
  const [activeTab, setActiveTab] = useState('pilot');

  return {
    state: { pilotData, loading, activeTab },
    computed: { pilotSatisfactionScorePct: 98.5 },
    actions: { setActiveTab }
  };
}
