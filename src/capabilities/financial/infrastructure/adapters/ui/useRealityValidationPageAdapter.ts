import { useState } from 'react';

export function useRealityValidationPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [realityData, setRealityData] = useState<any>({});
  return { realityData, loading };
}
