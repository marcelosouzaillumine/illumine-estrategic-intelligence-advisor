import { useState } from 'react';

export function useOKRsPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [okrsData, setOkrsData] = useState<any[]>([]);

  return { okrsData, loading };
}
