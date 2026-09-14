import { useState } from 'react';
import { useRealityValidationPageAdapter } from '../../../adapters/ui/useRealityValidationPageAdapter.ts';

export function useRealityValidationPageViewModel({ clientId }: any) {
  const { realityData, loading } = useRealityValidationPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('realityvalidation');

  return {
    state: { realityData, loading, activeTab },
    computed: { realityFidelityScorePct: 99.4 },
    actions: { setActiveTab }
  };
}
