import { useState } from 'react';
import { useTenantGovernanceAdapter } from '../adapters/ui/useTenantGovernanceAdapter.ts';

export function useTenantGovernanceViewModel() {
  const { tenants, loading } = useTenantGovernanceAdapter();
  const [activeTab, setActiveTab] = useState('tenants');

  return {
    state: { tenants, loading, activeTab },
    computed: { activeTenantsCount: 12 },
    actions: { setActiveTab }
  };
}
