import { useState } from 'react';

export function usePlanoEstrategicoGlobalPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [planData, setPlanData] = useState<any>({});
  return { planData, loading };
}
