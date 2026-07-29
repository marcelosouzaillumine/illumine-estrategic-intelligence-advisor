import { useState } from 'react';

export function useInstitutionalDeploymentReadinessPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [readinessData, setReadinessData] = useState<any>({});

  return { readinessData, loading };
}
