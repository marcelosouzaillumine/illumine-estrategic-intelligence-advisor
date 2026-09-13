import { useState } from 'react';
import { usePlanoDeContasAdapter } from '../../../adapters/ui/usePlanoDeContasAdapter';

export function usePlanoDeContasViewModel({ clientId }: any) {
  const { accounts, loading } = usePlanoDeContasAdapter(clientId);
  const [activeTab, setActiveTab] = useState('accounts');

  return {
    state: {
      accounts,
      loading,
      activeTab
    },
    computed: {
      accountsCount: accounts.length
    },
    actions: {
      setActiveTab
    }
  };
}
