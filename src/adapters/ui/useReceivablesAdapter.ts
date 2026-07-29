import { useState } from 'react';

export function useReceivablesAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [receivablesList, setReceivablesList] = useState<any[]>([]);

  return {
    receivablesList,
    loading
  };
}
