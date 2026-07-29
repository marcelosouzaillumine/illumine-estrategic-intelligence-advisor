import { useState } from 'react';
import { usePremissasClienteAdapter } from '../adapters/ui/usePremissasClienteAdapter.ts';

export function usePremissasClienteViewModel({ clientId }: any) {
  const { assumptions, loading } = usePremissasClienteAdapter(clientId);
  const [activeTab, setActiveTab] = useState('list');

  return {
    state: {
      assumptions,
      loading,
      activeTab
    },
    computed: {
      totalAssumptions: 12
    },
    actions: {
      setActiveTab
    }
  };
}
