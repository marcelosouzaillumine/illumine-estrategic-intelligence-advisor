import { useState } from 'react';

export function useRuntimePerformanceAdapter() {
  const [loading, setLoading] = useState(false);
  const [perfData, setPerfData] = useState<any[]>([]);

  return { perfData, loading };
}
