import { useState } from 'react';

export function useInstitutionalObservabilityPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [observabilityData, setObservabilityData] = useState<any>({});

  return { observabilityData, loading };
}
