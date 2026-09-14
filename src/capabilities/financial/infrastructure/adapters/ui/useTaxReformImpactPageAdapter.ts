import { useState } from 'react';

export function useTaxReformImpactPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [taxReformData, setTaxReformData] = useState<any>({});
  return { taxReformData, loading };
}
