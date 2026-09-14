import { useState } from 'react';

export function useOKRsAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [okrs, setOkrs] = useState<any[]>([]);

  return {
    okrs,
    loading
  };
}
