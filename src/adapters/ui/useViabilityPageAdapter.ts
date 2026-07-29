import { useState } from 'react';

export function useViabilityPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [viabilityData, setViabilityData] = useState<any>({});
  return { viabilityData, loading };
}
