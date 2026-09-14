import { useState } from 'react';

export function useInstitutionalStrategicIntelligenceAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [strategicItems, setStrategicItems] = useState<any[]>([]);

  return {
    strategicItems,
    loading
  };
}
