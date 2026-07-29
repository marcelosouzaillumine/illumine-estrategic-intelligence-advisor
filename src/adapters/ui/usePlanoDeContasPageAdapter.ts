import { useState } from 'react';

export function usePlanoDeContasPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [chartOfAccounts, setChartOfAccounts] = useState<any[]>([]);
  return { chartOfAccounts, loading };
}
