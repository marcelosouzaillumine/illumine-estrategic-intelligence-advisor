import { useState } from 'react';

export function useAnaliseFinanceiraAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [finData, setFinData] = useState<any>({});

  return { finData, loading };
}
