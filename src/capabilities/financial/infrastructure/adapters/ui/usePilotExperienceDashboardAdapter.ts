import { useState } from 'react';

export function usePilotExperienceDashboardAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [pilotData, setPilotData] = useState<any>({});

  return { pilotData, loading };
}
