import { useState } from 'react';
import { useAnaliseMercadoAdapter } from '../../../adapters/ui/useAnaliseMercadoAdapter.ts';

export function useAnaliseMercadoViewModel({ clientId }: any) {
  const { marketData, loading } = useAnaliseMercadoAdapter(clientId);
  const [activeTab, setActiveTab] = useState('benchmarks');

  return {
    state: { marketData, loading, activeTab },
    computed: { marketSharePct: 14.2 },
    actions: { setActiveTab }
  };
}
