import { useState } from 'react';
import { useTenantGovernancePageAdapter } from '../adapters/ui/useTenantGovernancePageAdapter.ts';

export function useTenantGovernancePageViewModel({ clientId }: any) {
  const { tenantGovData, loading } = useTenantGovernancePageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('tenantgov');

  return {
    state: { tenantGovData, loading, activeTab },
    computed: { isTenantIsolationVerified: true },
    actions: { setActiveTab }
  };
}
