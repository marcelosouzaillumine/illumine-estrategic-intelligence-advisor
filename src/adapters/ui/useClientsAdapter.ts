import { useState } from 'react';

export function useClientsAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [clientsList, setClientsList] = useState<any[]>([]);

  return {
    clientsList,
    loading
  };
}
