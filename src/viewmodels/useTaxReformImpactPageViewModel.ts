import { useState } from 'react';
import { useTaxReformImpactPageAdapter } from '../adapters/ui/useTaxReformImpactPageAdapter.ts';

export function useTaxReformImpactPageViewModel({ clientId }: any) {
  const { taxReformData, loading } = useTaxReformImpactPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('taxreform');

  return {
    state: { taxReformData, loading, activeTab },
    computed: { estimatedIbsCbsRatePct: 26.5 },
    actions: { setActiveTab }
  };
}
