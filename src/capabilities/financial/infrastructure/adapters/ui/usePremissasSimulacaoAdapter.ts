import { useState } from 'react';

export function usePremissasSimulacaoAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [premissas, setPremissas] = useState<any[]>([]);

  return {
    premissas,
    loading
  };
}
