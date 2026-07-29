import { useState } from 'react';

export function useFinancialModelingPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [modelingData, setModelingData] = useState<any>({});

  return { modelingData, loading };
}
