import { useState } from 'react';

export function useProductGovernancePageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [productGovData, setProductGovData] = useState<any>({});
  return { productGovData, loading };
}
