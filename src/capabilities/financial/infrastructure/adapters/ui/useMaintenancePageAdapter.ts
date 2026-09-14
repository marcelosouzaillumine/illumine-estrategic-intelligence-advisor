import { useState } from 'react';

export function useMaintenancePageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [maintenanceData, setMaintenanceData] = useState<any>({});

  return { maintenanceData, loading };
}
