import { useState } from 'react';
import { useValuationPageAdapter } from '../../../adapters/ui/useValuationPageAdapter.ts';

export function useValuationPageViewModel({ clientId }: any) {
  const { valuationData, loading } = useValuationPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('valuation');

  return {
    state: { valuationData, loading, activeTab },
    computed: { estimatedCompanyValue: 120000000 },
    actions: { setActiveTab }
  };
}
