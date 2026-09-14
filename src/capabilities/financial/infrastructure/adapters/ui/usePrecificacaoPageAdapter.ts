import { useState } from 'react';

export function usePrecificacaoPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [pricingData, setPricingData] = useState<any>({});
  return { pricingData, loading };
}
