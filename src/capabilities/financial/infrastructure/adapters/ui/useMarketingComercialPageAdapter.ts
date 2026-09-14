import { useState } from 'react';

export function useMarketingComercialPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [marketingData, setMarketingData] = useState<any>({});

  return { marketingData, loading };
}
