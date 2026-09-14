import { useState } from 'react';
import { useInstitutionalDigitalTwinPageAdapter } from '../../../adapters/ui/useInstitutionalDigitalTwinPageAdapter.ts';

export function useInstitutionalDigitalTwinPageViewModel({ clientId }: any) {
  const { digitalTwinData, loading } = useInstitutionalDigitalTwinPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('digitaltwin');

  return {
    state: { digitalTwinData, loading, activeTab },
    computed: { twinFidelityScorePct: 98.9 },
    actions: { setActiveTab }
  };
}
