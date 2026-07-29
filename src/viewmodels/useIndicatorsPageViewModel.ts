import { useState } from 'react';
import { useIndicatorsPageAdapter } from '../adapters/ui/useIndicatorsPageAdapter.ts';

export function useIndicatorsPageViewModel({ clientId }: any) {
  const { indicatorsData, loading } = useIndicatorsPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('indicators');

  return {
    state: { indicatorsData, loading, activeTab },
    computed: { keyMetricsCount: 16 },
    actions: { setActiveTab }
  };
}
