import { useState } from 'react';

export function useRelatorioExecutivoAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>({});

  return { report, loading };
}
