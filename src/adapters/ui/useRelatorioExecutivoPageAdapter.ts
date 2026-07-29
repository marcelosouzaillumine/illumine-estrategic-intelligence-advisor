import { useState } from 'react';

export function useRelatorioExecutivoPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [executiveReportData, setExecutiveReportData] = useState<any>({});
  return { executiveReportData, loading };
}
