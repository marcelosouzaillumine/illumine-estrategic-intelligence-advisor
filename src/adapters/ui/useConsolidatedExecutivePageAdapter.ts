import { useState } from 'react';

export function useConsolidatedExecutivePageAdapter() {
  const [loading, setLoading] = useState(false);
  const [consolidatedData, setConsolidatedData] = useState<any>({});

  return { consolidatedData, loading };
}
