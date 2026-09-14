import { useState } from 'react';

export function useLoansPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [loansData, setLoansData] = useState<any[]>([]);

  return { loansData, loading };
}
