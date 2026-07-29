import { useState } from 'react';
import { useOperacionalPageAdapter } from '../adapters/ui/useOperacionalPageAdapter.ts';

export function useOperacionalPageViewModel({ clientId }: any) {
  const { operacionalData, loading } = useOperacionalPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('operacional');

  return {
    state: { operacionalData, loading, activeTab },
    computed: { operationalEfficiencyScore: 94.8 },
    actions: { setActiveTab }
  };
}
