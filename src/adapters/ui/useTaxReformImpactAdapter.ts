import { useState } from 'react';

export function useTaxReformImpactAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [impacts, setImpacts] = useState<any[]>([]);

  return {
    impacts,
    loading
  };
}
