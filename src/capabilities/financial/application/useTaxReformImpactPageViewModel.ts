import { useState } from 'react';
import { useTaxReformImpactPageAdapter } from '../../../adapters/ui/useTaxReformImpactPageAdapter.ts';

export function useTaxReformImpactPageViewModel({ clientId }: any) {
  const { taxReformData, loading } = useTaxReformImpactPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('taxreform');

  const capability: any = {
    status: 'UNAVAILABLE',
    reason: 'PRICING_DATA_SOURCE_NOT_MIGRATED'
  };

  return {
    state: { taxReformData, loading, activeTab, capability },
    computed: { estimatedIbsCbsRatePct: 26.5 },
    actions: { setActiveTab }
  };
}
