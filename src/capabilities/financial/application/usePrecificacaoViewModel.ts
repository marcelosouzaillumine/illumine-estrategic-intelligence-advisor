import { useState } from 'react';
import { usePrecificacaoAdapter } from '../../../adapters/ui/usePrecificacaoAdapter.ts';

export function usePrecificacaoViewModel({ clientId }: any) {
  const { data, loading } = usePrecificacaoAdapter(clientId);
  const [activeTab, setActiveTab] = useState('calc');

  return {
    state: {
      data,
      loading,
      activeTab
    },
    computed: {
      markupAverage: 2.35
    },
    actions: {
      setActiveTab
    }
  };
}
