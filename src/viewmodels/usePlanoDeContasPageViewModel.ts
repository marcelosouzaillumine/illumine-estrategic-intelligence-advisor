import { useState } from 'react';
import { usePlanoDeContasPageAdapter } from '../adapters/ui/usePlanoDeContasPageAdapter.ts';

export function usePlanoDeContasPageViewModel({ clientId }: any) {
  const { chartOfAccounts, loading } = usePlanoDeContasPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('planodecontas');

  return {
    state: { chartOfAccounts, loading, activeTab },
    computed: { totalAccounts: 245 },
    actions: { setActiveTab }
  };
}
