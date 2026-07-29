import { useState } from 'react';
import { useLoanInvestmentSimPageAdapter } from '../adapters/ui/useLoanInvestmentSimPageAdapter.ts';

export function useLoanInvestmentSimPageViewModel({ clientId }: any) {
  const { simData, loading } = useLoanInvestmentSimPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('loansim');

  return {
    state: { simData, loading, activeTab },
    computed: { simulatedNPV: 15400000 },
    actions: { setActiveTab }
  };
}
