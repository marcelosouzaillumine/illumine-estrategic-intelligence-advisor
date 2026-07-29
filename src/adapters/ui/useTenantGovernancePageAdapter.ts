import { useState } from 'react';

export function useTenantGovernancePageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [tenantGovData, setTenantGovData] = useState<any>({});
  return { tenantGovData, loading };
}
