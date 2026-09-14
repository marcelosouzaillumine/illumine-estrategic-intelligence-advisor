import { useState } from 'react';

export function useInstitutionalBenchmarkingAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [benchmarkData, setBenchmarkData] = useState<any[]>([]);

  return {
    benchmarkData,
    loading
  };
}
