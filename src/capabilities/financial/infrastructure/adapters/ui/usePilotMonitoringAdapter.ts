import { useState } from 'react';

export function usePilotMonitoringAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [pilots, setPilots] = useState<any[]>([]);

  return {
    pilots,
    loading
  };
}
