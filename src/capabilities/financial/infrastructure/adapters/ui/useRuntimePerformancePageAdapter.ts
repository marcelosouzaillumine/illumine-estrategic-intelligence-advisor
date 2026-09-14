import { useState } from 'react';

export function useRuntimePerformancePageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [perfData, setPerfData] = useState<any>({});
  return { perfData, loading };
}
