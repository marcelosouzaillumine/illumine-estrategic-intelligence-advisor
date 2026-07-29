import { useState } from 'react';
import { useProductGovernancePageAdapter } from '../adapters/ui/useProductGovernancePageAdapter.ts';

export function useProductGovernancePageViewModel({ clientId }: any) {
  const { productGovData, loading } = useProductGovernancePageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('productgov');

  return {
    state: { productGovData, loading, activeTab },
    computed: { productCompliancePct: 100.0 },
    actions: { setActiveTab }
  };
}
