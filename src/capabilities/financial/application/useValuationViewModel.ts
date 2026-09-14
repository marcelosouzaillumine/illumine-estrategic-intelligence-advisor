import { useState } from 'react';
import { useValuationAdapter } from '../../../adapters/ui/useValuationAdapter.ts';

export function useValuationViewModel({ clientId }: any) {
  const { planData, loading } = useValuationAdapter(clientId);
  const [activeTab, setActiveTab] = useState('summary');

  return {
    state: {
      planData,
      loading,
      activeTab
    },
    computed: {
      enterpriseValueScore: 12000000.0
    },
    actions: {
      setActiveTab
    }
  };
}
