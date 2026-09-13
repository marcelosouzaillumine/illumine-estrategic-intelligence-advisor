import { useState } from 'react';
import { usePrecificacaoPageAdapter } from '../../../adapters/ui/usePrecificacaoPageAdapter.ts';

export function usePrecificacaoPageViewModel({ clientId }: any) {
  const { pricingData, loading } = usePrecificacaoPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('precificacao');

  return {
    state: { pricingData, loading, activeTab },
    computed: { averageContributionMarginPct: 42.5 },
    actions: { setActiveTab }
  };
}
