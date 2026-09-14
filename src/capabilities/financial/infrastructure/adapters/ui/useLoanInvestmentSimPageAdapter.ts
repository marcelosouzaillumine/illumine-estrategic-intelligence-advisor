import { useState } from 'react';

export function useLoanInvestmentSimPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [simData, setSimData] = useState<any>({});

  return { simData, loading };
}
