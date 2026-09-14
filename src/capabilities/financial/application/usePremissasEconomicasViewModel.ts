import { useState } from 'react';
import { usePremissasEconomicasAdapter } from '../../../adapters/ui/usePremissasEconomicasAdapter.ts';

export function usePremissasEconomicasViewModel() {
  const { data, loading } = usePremissasEconomicasAdapter();
  const [activeTab, setActiveTab] = useState('macro');

  return {
    state: { data, loading, activeTab },
    computed: { selicRate: 10.5 },
    actions: { setActiveTab }
  };
}
