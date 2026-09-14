import { useState } from 'react';

export function useValuationPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [valuationData, setValuationData] = useState<any>({});
  return { valuationData, loading };
}
