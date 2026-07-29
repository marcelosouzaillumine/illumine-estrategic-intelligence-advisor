import { useState } from 'react';

export function useEFOSPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [efosData, setEfosData] = useState<any>({});

  return { efosData, loading };
}
