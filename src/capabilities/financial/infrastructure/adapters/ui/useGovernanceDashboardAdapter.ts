import { useState } from 'react';

export function useGovernanceDashboardAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [governanceData, setGovernanceData] = useState<any[]>([]);

  return {
    governanceData,
    loading
  };
}
