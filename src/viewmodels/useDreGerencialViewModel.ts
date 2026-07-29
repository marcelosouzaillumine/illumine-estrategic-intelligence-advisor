import { useState } from 'react';
import { useDreGerencialAdapter } from '../adapters/ui/useDreGerencialAdapter.ts';

export function useDreGerencialViewModel({ clientId }: any) {
  const { data, loading } = useDreGerencialAdapter(clientId);
  const [activeTab, setActiveTab] = useState('summary');

  return {
    state: {
      data,
      loading,
      activeTab
    },
    computed: {
      ebitdaMargin: 18.5
    },
    actions: {
      setActiveTab
    }
  };
}
