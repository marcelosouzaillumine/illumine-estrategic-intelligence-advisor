import { useState } from 'react';

export function useRuntimeObservabilityAdapter() {
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<any[]>([]);

  return { metrics, loading };
}
