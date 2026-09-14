import { useState } from 'react';

export function useInstitutionalMonitoringPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [monitoringData, setMonitoringData] = useState<any>({});

  return { monitoringData, loading };
}
