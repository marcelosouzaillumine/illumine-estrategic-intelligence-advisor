import { useState } from 'react';
import { usePortfolioAdapter } from '../../../adapters/ui/usePortfolioAdapter.ts';

export function usePortfolioViewModel({ clientId }: any) {
  const { portfolio, loading } = usePortfolioAdapter(clientId);
  const [activeTab, setActiveTab] = useState('summary');

  return {
    state: {
      portfolio,
      loading,
      activeTab
    },
    computed: {
      totalPortfolioValue: 3500000.0
    },
    actions: {
      setActiveTab
    }
  };
}
