import { useState } from 'react';

export function useAnaliseMercadoAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [marketData, setMarketData] = useState<any>({});

  return { marketData, loading };
}
