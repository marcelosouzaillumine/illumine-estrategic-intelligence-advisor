import { useState } from 'react';

export function useIndicatorsPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [indicatorsData, setIndicatorsData] = useState<any[]>([]);

  return { indicatorsData, loading };
}
