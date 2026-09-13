import { useState } from 'react';
import { useDreGerencialPageAdapter } from '../../../adapters/ui/useDreGerencialPageAdapter.ts';

export function useDreGerencialPageViewModel({ clientId }: any) {
  const { dreGerencialData, loading } = useDreGerencialPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('managerial');

  return {
    state: { dreGerencialData, loading, activeTab },
    computed: { netContributionMargin: 35.2 },
    actions: { setActiveTab }
  };
}
