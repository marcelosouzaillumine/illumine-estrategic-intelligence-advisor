import { useState } from 'react';
import { usePremissasTributariasPageAdapter } from '../adapters/ui/usePremissasTributariasPageAdapter.ts';

export function usePremissasTributariasPageViewModel({ clientId }: any) {
  const { taxData, loading } = usePremissasTributariasPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('premissastributarias');

  return {
    state: { taxData, loading, activeTab },
    computed: { effectiveTaxRatePct: 15.2 },
    actions: { setActiveTab }
  };
}
