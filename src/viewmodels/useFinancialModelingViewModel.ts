import { useState } from 'react';
import { useFinancialModelingAdapter } from '../adapters/ui/useFinancialModelingAdapter.ts';

export function useFinancialModelingViewModel({ clientId }: any) {
  const { scenarios, loading } = useFinancialModelingAdapter(clientId);
  const [activeTab, setActiveTab] = useState('scenarios');

  return {
    state: {
      scenarios,
      loading,
      activeTab
    },
    computed: {
      scenariosCount: scenarios.length
    },
    actions: {
      setActiveTab
    }
  };
}
