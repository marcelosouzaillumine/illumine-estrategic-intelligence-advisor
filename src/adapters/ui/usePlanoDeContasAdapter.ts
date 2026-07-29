import { useState } from 'react';

export function usePlanoDeContasAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);

  return {
    accounts,
    loading
  };
}
