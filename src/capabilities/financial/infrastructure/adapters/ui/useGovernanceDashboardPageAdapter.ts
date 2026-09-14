import { useState } from 'react';

export function useGovernanceDashboardPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [governanceDashboardData, setGovernanceDashboardData] = useState<any>({});

  return { governanceDashboardData, loading };
}
