import { useState } from 'react';

export function useAxisDashboardAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [axisMetrics, setAxisMetrics] = useState<any[]>([]);

  return { axisMetrics, loading };
}
