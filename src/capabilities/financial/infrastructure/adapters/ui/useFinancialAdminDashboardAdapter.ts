import { useState } from 'react';

export function useFinancialAdminDashboardAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [adminData, setAdminData] = useState<any>({});

  return { adminData, loading };
}
