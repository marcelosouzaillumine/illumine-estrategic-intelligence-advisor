import { useState } from 'react';

export function usePayablesPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [payablesData, setPayablesData] = useState<any[]>([]);

  return { payablesData, loading };
}
