import { useState } from 'react';
import { useValueCreationAdapter } from '../adapters/ui/useValueCreationAdapter.ts';

export function useValueCreationViewModel({ clientId }: any) {
  const { planData, loading } = useValueCreationAdapter(clientId);
  const [activeTab, setActiveTab] = useState('summary');

  return {
    state: {
      planData,
      loading,
      activeTab
    },
    computed: {
      irrPerformanceScore: 24.5
    },
    actions: {
      setActiveTab
    }
  };
}
