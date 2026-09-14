import { useState } from 'react';

export function useInstitutionalDeploymentReadinessAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [readinessData, setReadinessData] = useState<any[]>([]);

  return {
    readinessData,
    loading
  };
}
