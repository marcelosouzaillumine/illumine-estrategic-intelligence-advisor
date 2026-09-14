import { useState } from 'react';

export function useTenantGovernanceAdapter() {
  const [loading, setLoading] = useState(false);
  const [tenants, setTenants] = useState<any[]>([]);

  return { tenants, loading };
}
