import { useState } from 'react';
import { useOrcamentoPageAdapter } from '../../../adapters/ui/useOrcamentoPageAdapter.ts';

export function useOrcamentoPageViewModel({ clientId }: any) {
  const { orcamentoData, loading } = useOrcamentoPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('orcamento');

  return {
    state: { orcamentoData, loading, activeTab },
    computed: { budgetAdherencePct: 98.2 },
    actions: { setActiveTab }
  };
}
