import { useState } from 'react';

export function useQuadroPessoalPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [headcountData, setHeadcountData] = useState<any[]>([]);
  return { headcountData, loading };
}
