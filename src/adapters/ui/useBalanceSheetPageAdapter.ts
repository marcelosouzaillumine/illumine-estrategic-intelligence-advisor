import { useState } from 'react';

export function useBalanceSheetPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [balanceData, setBalanceData] = useState<any>({});

  return { balanceData, loading };
}
