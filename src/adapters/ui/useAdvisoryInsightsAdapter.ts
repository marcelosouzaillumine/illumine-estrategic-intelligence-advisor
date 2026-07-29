import { useState } from 'react';

export function useAdvisoryInsightsAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);

  return { insights, loading };
}
