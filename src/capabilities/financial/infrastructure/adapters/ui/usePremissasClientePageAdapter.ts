import { useState } from 'react';

export function usePremissasClientePageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [assumptionsData, setAssumptionsData] = useState<any>({});
  return { assumptionsData, loading };
}
