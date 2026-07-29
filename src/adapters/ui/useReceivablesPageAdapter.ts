import { useState } from 'react';

export function useReceivablesPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [receivablesData, setReceivablesData] = useState<any[]>([]);
  return { receivablesData, loading };
}
