import { useState } from 'react';

export function useDiagnosticoPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [diagnosticsData, setDiagnosticsData] = useState<any>({});

  return { diagnosticsData, loading };
}
