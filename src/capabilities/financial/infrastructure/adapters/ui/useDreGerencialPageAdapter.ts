import { useState } from 'react';

export function useDreGerencialPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [dreGerencialData, setDreGerencialData] = useState<any>({});

  return { dreGerencialData, loading };
}
