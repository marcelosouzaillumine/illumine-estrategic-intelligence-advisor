import { useState } from 'react';

export function useCashFlowAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);

  return {
    entries,
    loading
  };
}
