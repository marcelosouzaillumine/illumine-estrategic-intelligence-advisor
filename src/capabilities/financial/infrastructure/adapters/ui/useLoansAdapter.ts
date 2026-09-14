import { useState } from 'react';

export function useLoansAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [loans, setLoans] = useState<any[]>([]);

  return {
    loans,
    loading
  };
}
