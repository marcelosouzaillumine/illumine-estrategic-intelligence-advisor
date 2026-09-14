import { useState } from 'react';

export function useOrcamentoPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [orcamentoData, setOrcamentoData] = useState<any>({});

  return { orcamentoData, loading };
}
