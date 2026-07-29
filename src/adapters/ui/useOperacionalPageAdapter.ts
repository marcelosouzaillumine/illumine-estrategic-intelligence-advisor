import { useState } from 'react';

export function useOperacionalPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [operacionalData, setOperacionalData] = useState<any>({});

  return { operacionalData, loading };
}
