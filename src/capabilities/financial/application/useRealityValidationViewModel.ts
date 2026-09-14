import { useState } from 'react';
import { useRealityValidationAdapter } from '../../../adapters/ui/useRealityValidationAdapter';

export function useRealityValidationViewModel({ clientId }: any) {
  const { realityItems, loading } = useRealityValidationAdapter(clientId);
  const [activeTab, setActiveTab] = useState('reality');

  return {
    state: {
      realityItems,
      loading,
      activeTab
    },
    computed: {
      accuracyScore: 97.8
    },
    actions: {
      setActiveTab
    }
  };
}
