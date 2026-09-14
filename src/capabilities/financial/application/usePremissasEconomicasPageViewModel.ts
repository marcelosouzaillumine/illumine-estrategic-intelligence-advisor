import { useState } from 'react';
import { usePremissasEconomicasPageAdapter } from '../../../adapters/ui/usePremissasEconomicasPageAdapter.ts';

export function usePremissasEconomicasPageViewModel({ clientId }: any) {
  const { economicData, loading } = usePremissasEconomicasPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('premissaseconomicas');

  return {
    state: { economicData, loading, activeTab },
    computed: { selicRatePct: 10.5 },
    actions: { setActiveTab }
  };
}
