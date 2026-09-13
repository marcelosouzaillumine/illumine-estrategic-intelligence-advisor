import { useState } from 'react';
import { useTaxReformImpactAdapter } from '../../../adapters/ui/useTaxReformImpactAdapter.ts';

export function useTaxReformImpactViewModel({ clientId }: any) {
  const { impacts, loading } = useTaxReformImpactAdapter(clientId);
  const [activeTab, setActiveTab] = useState('summary');

  return {
    state: {
      impacts,
      loading,
      activeTab
    },
    computed: {
      estimatedIbsCbsImpactPct: 2.8
    },
    actions: {
      setActiveTab
    }
  };
}
