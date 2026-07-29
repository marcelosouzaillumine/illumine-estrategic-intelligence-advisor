import { useState } from 'react';
import { usePlanoEstrategicoGlobalAdapter } from '../adapters/ui/usePlanoEplanEstrategicoGlobalAdapter.ts';

export function usePlanoEstrategicoGlobalViewModel({ clientId }: any) {
  const { planData, loading } = usePlanoEstrategicoGlobalAdapter(clientId);
  const [activeTab, setActiveTab] = useState('pillars');

  return {
    state: {
      planData,
      loading,
      activeTab
    },
    computed: {
      strategicAdherenceScore: 91.5
    },
    actions: {
      setActiveTab
    }
  };
}
