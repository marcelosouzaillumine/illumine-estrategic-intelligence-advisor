import { useState } from 'react';

export function useInstitutionalMonitoringAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [monitors, setMonitors] = useState<any[]>([]);

  return {
    monitors,
    loading
  };
}
