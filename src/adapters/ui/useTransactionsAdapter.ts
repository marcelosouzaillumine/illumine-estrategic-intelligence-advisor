import { useState } from 'react';

export function useTransactionsAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  return {
    transactions,
    loading
  };
}
