import { useState } from 'react';

export function useInstitutionalReportsAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [reportsList, setReportsList] = useState<any[]>([]);

  return {
    reportsList,
    loading
  };
}
