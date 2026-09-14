import { useState } from 'react';
import { usePlanoEstrategicoGlobalPageAdapter } from '../../../adapters/ui/usePlanoEstrategicoGlobalPageAdapter.ts';

export function usePlanoEstrategicoGlobalPageViewModel({ clientId }: any) {
  const { planData, loading } = usePlanoEstrategicoGlobalPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('planoestrategico');

  return {
    state: { planData, loading, activeTab },
    computed: { strategicPillarsCount: 5 },
    actions: { setActiveTab }
  };
}
