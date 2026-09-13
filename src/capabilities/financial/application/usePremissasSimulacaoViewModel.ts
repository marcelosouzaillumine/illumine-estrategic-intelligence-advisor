import { useState } from 'react';
import { usePremissasSimulacaoAdapter } from '../../../adapters/ui/usePremissasSimulacaoAdapter.ts';

export function usePremissasSimulacaoViewModel({ clientId }: any) {
  const { premissas, loading } = usePremissasSimulacaoAdapter(clientId);
  const [activeTab, setActiveTab] = useState('premissas');

  return {
    state: {
      premissas,
      loading,
      activeTab
    },
    computed: {
      premissasCount: premissas.length
    },
    actions: {
      setActiveTab
    }
  };
}
