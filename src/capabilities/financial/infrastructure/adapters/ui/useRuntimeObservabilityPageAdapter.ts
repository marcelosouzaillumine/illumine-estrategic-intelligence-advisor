import { useState } from 'react';

export function useRuntimeObservabilityPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [runtimeObsData, setRuntimeObsData] = useState<any>({});
  return { runtimeObsData, loading };
}
