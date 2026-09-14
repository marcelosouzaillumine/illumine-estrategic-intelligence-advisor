import { useState } from 'react';

export function useEarlyWarningPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]);

  return { alerts, loading };
}
