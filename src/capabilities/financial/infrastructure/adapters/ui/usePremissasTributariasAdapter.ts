import { useState } from 'react';

export function usePremissasTributariasAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [assumptions, setAssumptions] = useState<any[]>([]);

  return {
    assumptions,
    loading
  };
}
