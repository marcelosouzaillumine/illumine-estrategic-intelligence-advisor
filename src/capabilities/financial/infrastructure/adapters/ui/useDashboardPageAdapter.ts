import { useState } from 'react';

export function useDashboardPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>({});

  return { dashboardData, loading };
}
