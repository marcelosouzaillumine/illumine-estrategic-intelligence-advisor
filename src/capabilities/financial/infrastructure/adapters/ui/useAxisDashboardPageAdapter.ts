import { useState } from 'react';

export function useAxisDashboardPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [axisData, setAxisData] = useState<any>({});

  return { axisData, loading };
}
