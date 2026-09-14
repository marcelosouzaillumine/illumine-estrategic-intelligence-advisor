import { useState } from 'react';

export function usePremissasEconomicasPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [economicData, setEconomicData] = useState<any>({});
  return { economicData, loading };
}
