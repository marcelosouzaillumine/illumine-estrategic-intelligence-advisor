import { useState } from 'react';

export function useInstitutionalReportsPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [reportsData, setReportsData] = useState<any[]>([]);

  return { reportsData, loading };
}
