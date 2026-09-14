import { useState } from 'react';

export function usePilotMonitoringDashboardAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [pilotMonitoringData, setPilotMonitoringData] = useState<any>({});
  return { pilotMonitoringData, loading };
}
