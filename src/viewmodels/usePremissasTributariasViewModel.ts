import { useState } from 'react';
import { usePremissasTributariasAdapter } from '../adapters/ui/usePremissasTributariasAdapter.ts';

export function usePremissasTributariasViewModel({ clientId }: any) {
  const { assumptions, loading } = usePremissasTributariasAdapter(clientId);
  const [activeTab, setActiveTab] = useState('list');

  return {
    state: {
      assumptions,
      loading,
      activeTab
    },
    computed: {
      effectiveTaxRate: 14.5
    },
    actions: {
      setActiveTab
    }
  };
}
