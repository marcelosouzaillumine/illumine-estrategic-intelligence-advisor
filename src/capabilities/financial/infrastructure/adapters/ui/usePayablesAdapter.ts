import { useState } from 'react';

export function usePayablesAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [payablesList, setPayablesList] = useState<any[]>([]);

  return {
    payablesList,
    loading
  };
}
