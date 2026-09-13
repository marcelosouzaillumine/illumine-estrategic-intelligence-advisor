import { useState } from 'react';
import { useViabilityAdapter } from '../../../adapters/ui/useViabilityAdapter.ts';

export function useViabilityViewModel({ clientId }: any) {
  const { projects, loading } = useViabilityAdapter(clientId);
  const [activeTab, setActiveTab] = useState('projects');

  return {
    state: { projects, loading, activeTab },
    computed: { averageInternalRateOfReturnPct: 22.4 },
    actions: { setActiveTab }
  };
}
