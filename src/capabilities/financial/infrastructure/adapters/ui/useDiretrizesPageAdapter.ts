import { useState } from 'react';

export function useDiretrizesPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [guidelines, setGuidelines] = useState<any[]>([]);

  return { guidelines, loading };
}
