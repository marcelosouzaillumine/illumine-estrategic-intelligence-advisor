import { useState } from 'react';

export function useInstitutionalBenchmarkingPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [benchmarkingData, setBenchmarkingData] = useState<any>({});

  return { benchmarkingData, loading };
}
