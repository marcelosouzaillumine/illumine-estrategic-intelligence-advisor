import { useState } from 'react';

export function usePrecificacaoAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  return {
    data,
    loading
  };
}
