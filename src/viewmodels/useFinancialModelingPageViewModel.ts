import { useState } from 'react';
import { useFinancialModelingPageAdapter } from '../adapters/ui/useFinancialModelingPageAdapter.ts';

export function useFinancialModelingPageViewModel({ clientId }: any) {
  const { modelingData, loading } = useFinancialModelingPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('modeling');

  return {
    state: { modelingData, loading, activeTab },
    computed: { modelAccuracyPct: 98.2 },
    actions: { setActiveTab }
  };
}
