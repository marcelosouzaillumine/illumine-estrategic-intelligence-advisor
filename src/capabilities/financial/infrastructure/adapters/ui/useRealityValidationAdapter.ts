import { useState } from 'react';

export function useRealityValidationAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [realityItems, setRealityItems] = useState<any[]>([]);

  return {
    realityItems,
    loading
  };
}
